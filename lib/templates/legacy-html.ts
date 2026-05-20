export const legacyHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Classic HTML Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #334155;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 64px 16px;
    }
    .container {
      max-width: 540px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 24px;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }
    .header {
      background-color: #0f172a;
      padding: 40px;
      text-align: center;
      color: #ffffff;
    }
    .header-logo {
      font-size: 24px;
      margin: 0 0 12px 0;
    }
    .header-tag {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #38bdf8;
      margin: 0;
    }
    .header-title {
      font-size: 22px;
      font-weight: 900;
      margin: 8px 0 0 0;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
    }
    .body-text {
      font-size: 14px;
      line-height: 1.65;
      color: #64748b;
      margin: 0 0 24px 0;
    }
    .btn-container {
      text-align: left;
      margin-top: 32px;
      margin-bottom: 8px;
    }
    .btn {
      display: inline-block;
      background-color: #0f172a;
      color: #ffffff !important;
      font-size: 11px;
      font-weight: 800;
      text-decoration: none;
      padding: 16px 28px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .footer {
      padding: 0 40px 40px 40px;
      text-align: center;
    }
    .divider {
      border: 0;
      border-top: 1px solid #f1f5f9;
      margin: 0 0 24px 0;
    }
    .footer-text {
      font-size: 11px;
      color: #94a3b8;
      margin: 0;
      line-height: 1.6;
    }
    .footer-text a {
      color: #0f172a;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Styled Header -->
      <div class="header">
        <p class="header-logo">⚡</p>
        <p class="header-tag">Standard Blueprint</p>
        <h1 class="header-title">Classic HTML Email</h1>
      </div>

      <!-- Main Body Content -->
      <div class="content">
        <p class="body-text">
          This is a raw HTML and inline-CSS email template. No modern React compilation is needed here—just standard, robust HTML that renders flawlessly across all classic email clients (like Outlook 2013 and Apple Mail).
        </p>
        <p class="body-text">
          Email.Pro provides full native compatibility for both modern React templates (compiled dynamically via Sucrase) and robust, pre-styled legacy HTML files.
        </p>
        
        <div class="btn-container">
          <a href="#" class="btn">Explore Integration &rarr;</a>
        </div>
      </div>

      <div class="footer">
        <hr class="divider">
        <p class="footer-text">
          Email.Pro Sandbox Utility · San Francisco, CA<br>
          <a href="#">Unsubscribe</a> · <a href="#">Security Settings</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`.trim();
