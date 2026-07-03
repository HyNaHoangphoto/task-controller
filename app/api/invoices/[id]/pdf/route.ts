import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { renderToStream, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { fontSize: 20, marginBottom: 4, color: "#34a853" },
  sub: { fontSize: 10, color: "#666", marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { color: "#666" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#ddd", marginVertical: 16 },
  total: { fontSize: 16, marginTop: 8 },
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, ownerId: userId },
    include: { project: { include: { client: true } } },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}># Task Controller</Text>
        <Text style={styles.sub}>Hoá đơn {invoice.code}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Dự án</Text>
          <Text>{invoice.project.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Khách hàng</Text>
          <Text>{invoice.project.client.name} — {invoice.project.client.company}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày phát hành</Text>
          <Text>{new Date(invoice.issueDate).toLocaleDateString("vi-VN")}</Text>
        </View>
        {invoice.dueDate && (
          <View style={styles.row}>
            <Text style={styles.label}>Hạn thanh toán</Text>
            <Text>{new Date(invoice.dueDate).toLocaleDateString("vi-VN")}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Tổng tiền</Text>
          <Text>{invoice.totalAmount.toLocaleString("vi-VN")} đ</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Đã thanh toán</Text>
          <Text>{invoice.paidAmount.toLocaleString("vi-VN")} đ</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ ...styles.label, fontSize: 13 }}>Còn lại</Text>
          <Text style={styles.total}>{(invoice.totalAmount - invoice.paidAmount).toLocaleString("vi-VN")} đ</Text>
        </View>

        {invoice.note && (
          <>
            <View style={styles.divider} />
            <Text style={styles.label}>Ghi chú: {invoice.note}</Text>
          </>
        )}
      </Page>
    </Document>
  );

  const stream = await renderToStream(doc);
  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.code}.pdf"`,
    },
  });
}
