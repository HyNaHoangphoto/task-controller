export type ProjectTemplateTask = { title: string; priority: "LOW" | "MEDIUM" | "HIGH"; dayOffset: number };
export type ProjectTemplatePhase = { name: string; startOffset: number; endOffset: number; tasks: ProjectTemplateTask[] };
export type ProjectTemplate = {
  key: string;
  name: string;
  tag: string;
  totalDays: number;
  phases: ProjectTemplatePhase[];
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    key: "video",
    name: "Video Production",
    tag: "Video",
    totalDays: 30,
    phases: [
      {
        name: "Tiền kỳ", startOffset: 0, endOffset: 7,
        tasks: [
          { title: "Nhận brief & họp kickoff", priority: "HIGH", dayOffset: 0 },
          { title: "Lên concept & moodboard", priority: "HIGH", dayOffset: 2 },
          { title: "Script & storyboard", priority: "HIGH", dayOffset: 4 },
        ],
      },
      {
        name: "Sản xuất", startOffset: 7, endOffset: 21,
        tasks: [
          { title: "Chuẩn bị props & casting", priority: "MEDIUM", dayOffset: 9 },
          { title: "Ngày quay chính", priority: "HIGH", dayOffset: 13 },
          { title: "Rough cut v1", priority: "HIGH", dayOffset: 17 },
          { title: "Nhận feedback khách", priority: "MEDIUM", dayOffset: 19 },
        ],
      },
      {
        name: "Hậu kỳ", startOffset: 21, endOffset: 30,
        tasks: [
          { title: "Fine cut + color grade", priority: "HIGH", dayOffset: 24 },
          { title: "Sound design & mix", priority: "MEDIUM", dayOffset: 27 },
          { title: "Export & delivery final", priority: "HIGH", dayOffset: 29 },
        ],
      },
    ],
  },
  {
    key: "motion",
    name: "Motion Design",
    tag: "Motion",
    totalDays: 21,
    phases: [
      { name: "Concept", startOffset: 0, endOffset: 5, tasks: [
        { title: "Nhận brief", priority: "HIGH", dayOffset: 0 },
        { title: "Storyboard / animatic", priority: "HIGH", dayOffset: 3 },
      ]},
      { name: "Design", startOffset: 5, endOffset: 12, tasks: [
        { title: "Style frame", priority: "HIGH", dayOffset: 6 },
        { title: "Duyệt style với khách", priority: "MEDIUM", dayOffset: 9 },
      ]},
      { name: "Animation", startOffset: 12, endOffset: 19, tasks: [
        { title: "Dựng animation", priority: "HIGH", dayOffset: 13 },
        { title: "Sound design", priority: "MEDIUM", dayOffset: 17 },
      ]},
      { name: "Bàn giao", startOffset: 19, endOffset: 21, tasks: [
        { title: "Render final & export", priority: "HIGH", dayOffset: 20 },
      ]},
    ],
  },
  {
    key: "web",
    name: "Web / Landing Page",
    tag: "Design",
    totalDays: 30,
    phases: [
      { name: "Discovery", startOffset: 0, endOffset: 5, tasks: [
        { title: "Nhận brief & research", priority: "HIGH", dayOffset: 0 },
        { title: "Sitemap & wireframe", priority: "MEDIUM", dayOffset: 3 },
      ]},
      { name: "UI Design", startOffset: 5, endOffset: 15, tasks: [
        { title: "Design hero + key sections", priority: "HIGH", dayOffset: 7 },
        { title: "Duyệt UI với khách", priority: "MEDIUM", dayOffset: 12 },
      ]},
      { name: "Development", startOffset: 15, endOffset: 27, tasks: [
        { title: "Code frontend", priority: "HIGH", dayOffset: 16 },
        { title: "Responsive & tối ưu tốc độ", priority: "MEDIUM", dayOffset: 22 },
      ]},
      { name: "Go-live", startOffset: 27, endOffset: 30, tasks: [
        { title: "Test & fix bug", priority: "HIGH", dayOffset: 27 },
        { title: "Deploy & bàn giao", priority: "HIGH", dayOffset: 29 },
      ]},
    ],
  },
  {
    key: "brand",
    name: "Brand Identity",
    tag: "Branding",
    totalDays: 30,
    phases: [
      { name: "Nghiên cứu", startOffset: 0, endOffset: 6, tasks: [
        { title: "Brief & phân tích thị trường", priority: "HIGH", dayOffset: 0 },
        { title: "Moodboard định hướng", priority: "MEDIUM", dayOffset: 4 },
      ]},
      { name: "Logo & màu sắc", startOffset: 6, endOffset: 16, tasks: [
        { title: "Phác thảo logo", priority: "HIGH", dayOffset: 7 },
        { title: "Duyệt logo với khách", priority: "MEDIUM", dayOffset: 13 },
      ]},
      { name: "Hệ thống nhận diện", startOffset: 16, endOffset: 27, tasks: [
        { title: "Bộ màu & typography", priority: "MEDIUM", dayOffset: 18 },
        { title: "Áp dụng lên ấn phẩm mẫu", priority: "MEDIUM", dayOffset: 23 },
      ]},
      { name: "Bàn giao", startOffset: 27, endOffset: 30, tasks: [
        { title: "Đóng gói brand guideline", priority: "HIGH", dayOffset: 29 },
      ]},
    ],
  },
  {
    key: "content",
    name: "Content / Copywriting",
    tag: "Content",
    totalDays: 20,
    phases: [
      { name: "Research", startOffset: 0, endOffset: 4, tasks: [
        { title: "Brief & tone of voice", priority: "HIGH", dayOffset: 0 },
        { title: "Research đối thủ & từ khoá", priority: "MEDIUM", dayOffset: 2 },
      ]},
      { name: "Viết nháp", startOffset: 4, endOffset: 13, tasks: [
        { title: "Outline nội dung", priority: "HIGH", dayOffset: 5 },
        { title: "Viết bản nháp", priority: "HIGH", dayOffset: 9 },
      ]},
      { name: "Duyệt & bàn giao", startOffset: 13, endOffset: 20, tasks: [
        { title: "Gửi khách duyệt", priority: "MEDIUM", dayOffset: 14 },
        { title: "Chỉnh sửa theo feedback", priority: "MEDIUM", dayOffset: 17 },
        { title: "Bàn giao bản final", priority: "HIGH", dayOffset: 19 },
      ]},
    ],
  },
];
