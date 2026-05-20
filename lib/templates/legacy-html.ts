export const legacyHtmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background-color: #f4f4f4; padding: 40px; }
    .card { background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-top: 0; }
    p { color: #666; line-height: 1.6; }
    .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Classic HTML Email</h1>
    <p>This is a raw HTML/CSS email template. No React involved here—just pure web standards.</p>
    <p>Email.Pro handles both modern React templates and legacy HTML templates seamlessly.</p>
    <a href="#" class="btn">Learn More</a>
  </div>
</body>
</html>
`.trim();
