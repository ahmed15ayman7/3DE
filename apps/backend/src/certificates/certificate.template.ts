export const getCertificateHtml = (data: {
  name: string;
  title: string;
  description: string;
  earnedAt: string;
  logoBase64: string;
}) => `
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&display=swap');

      * {
        box-sizing: border-box;
      }

      body {
        font-family: 'Cairo', sans-serif;
        margin: 0;
        padding: 0;
        direction: rtl;
        background-color: #ffffff;
      }

      .certificate {
        width: 1122px;
        height: 793px;
        padding: 60px;
        border: 16px solid #003f59;
        position: relative;
        overflow: hidden;
      }

      /* زخرفة الحواف */
      .decoration-top-right,
      .decoration-bottom-left {
        position: absolute;
        width: 300px;
        height: 300px;
        z-index: 0;
        opacity: 0.2;
      }

      .decoration-top-right {
        top: -60px;
        right: -60px;
        transform: rotate(15deg);
      }

      .decoration-bottom-left {
        bottom: -60px;
        left: -60px;
        transform: rotate(-15deg);
      }

      /* الشارة */
      .badge {
        position: absolute;
        top: 40px;
        left: 40px;
        width: 90px;
        height: 90px;
        background: radial-gradient(circle, #249491 60%, #003f59 100%);
        border-radius: 50%;
        border: 6px solid gold;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }

      .badge img {
        width: 60%;
        height: 60%;
        object-fit: contain;
      }

      .title {
        font-size: 52px;
        color: #003f59;
        text-align: center;
        margin: 0;
        position: relative;
        z-index: 2;
      }

      .subtitle {
        font-size: 24px;
        color: #249491;
        text-align: center;
        margin: 10px 0;
        position: relative;
        z-index: 2;
      }

      .name {
        font-size: 42px;
        font-weight: bold;
        color: #003f59;
        text-align: center;
        margin: 0;
        z-index: 2;
        position: relative;
      }

      .line {
        height: 4px;
        background: gold;
        width: 160px;
        margin: 20px auto;
        border-radius: 5px;
        z-index: 2;
        position: relative;
      }

      .description {
        font-size: 20px;
        color: #444;
        text-align: center;
        margin: 30px auto;
        width: 85%;
        line-height: 1.8;
        z-index: 2;
        position: relative;
      }

      .date {
        text-align: center;
        font-size: 18px;
        margin-top: 20px;
        color: #666;
        z-index: 2;
        position: relative;
      }

      .signature {
        margin-top: 40px;
        text-align: left;
        padding-left: 40px;
        z-index: 2;
        position: relative;
      }

      .signature p {
        font-size: 20px;
        font-weight: bold;
        color: #003f59;
        margin: 0;
      }
        .svg-decor-top-right {
        position: absolute;
        top: 0;
        right: 0;
        width: 180px;
      }

      .svg-decor-bottom-left {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 180px;
      }

      .logo {
        position: absolute;
        top: 40px;
        left: 40px;
        width: 80px;
      }
    </style>
  </head>
  <body>
    <div class="certificate">
      <!-- زخرفة -->
       <!-- الديكور العلوي -->
      <svg class="svg-decor-top-right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,0 C100,0 100,100 0,100 Z" fill="#003f59" />
        <path d="M0,10 C90,10 90,90 0,90 Z" fill="#249491" />
        <path d="M0,20 C80,20 80,80 0,80 Z" fill="#f3c300" />
      </svg>

      <!-- الديكور السفلي -->
      <svg class="svg-decor-bottom-left" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M100,100 C0,100 0,0 100,0 Z" fill="#003f59" />
        <path d="M100,90 C10,90 10,10 100,10 Z" fill="#249491" />
        <path d="M100,80 C20,80 20,20 100,20 Z" fill="#f3c300" />
      </svg>
      <!-- اللوجو داخل الشارة -->
      <div class="badge">
      <img src="${data.logoBase64}" class="logo" />
      </div>

      <h1 class="title">شهادة تقدير</h1>
      <p class="subtitle">تُمنح هذه الشهادة إلى</p>
      <h2 class="name">${data.name}</h2>
      <div class="line"></div>
      <p class="description">${data.description}</p>
      <p class="date">تاريخ الإنجاز: ${data.earnedAt}</p>

      <div class="signature">
        <p>المدير العام</p>
      </div>
    </div>
  </body>
</html>
`;
