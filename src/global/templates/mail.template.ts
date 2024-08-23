export const acceptCourseMail = (username: string, email: string, title: string) => `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #D9D9DB;
            padding: 10px 20px;
            color: black;
            text-align: center;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>COURSE VERIFICATION RESULT</h1>
        </div>
        <div class="content">
            <h3>Dear ${username ? username : email},</h3>
            <p>We are pleased to inform you that your course submission on <span style="color: #60A5FA;">Ci</span><span style="color: #116761;">Study</span> has been successfully reviewed and approved. Your course has met all the necessary criteria and standards set by our team.</p>
            <p>Your course titled <strong>"${title ?? "Untitled"}"</strong> has been thoroughly evaluated and we are delighted to inform you that it has been approved. You can now see your course live on our platform and accessible to all users.</p>
            <p>We appreciate the effort and dedication you have put into creating this course. We believe it will be a valuable resource for learners on our platform.</p>
            <p>Should you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
            <p>Thank you for being a part of <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>.</p>
            <p>Best regards,</p>
            Cistudy Support Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
        `
export const rejectCourseMail = (username: string, email: string, title: string, note: string, courseId: string) => `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Course Verification Status on CiStudy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #D9D9DB;
            padding: 10px 20px;
            color: black;
            text-align: center;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: white;
            background-color: #60A5FA;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>COURSE VERIFICATION RESULT</h1>
        </div>
        <div class="content">
            <h3>Dear ${username ?? email},</h3>
            <p>Thank you for your recent course submission on <span style="color: #60A5FA, font-weight:900">Ci</span><span style="color: #006FEE, font-weight:900">Study</span>. We appreciate your effort in contributing to our learning community.</p>
            <p>After a thorough review of your course titled <strong>"${title}"</strong>, we regret to inform you that it does not meet the necessary criteria and standards for approval.</p>
            ${note ? `
            <p>We also gives you a note about your course's content that require improvement: </p>
            <ul>
                <p>${note}</p>
            </ul>        
            ` : null}
            <p>We encourage you to revise and enhance your course based on the feedback provided. Once you have made the necessary improvements, you are welcome to resubmit your course for review.</p>
            <p>If you have any questions or need further guidance on how to improve your course, please feel free to contact our support team.</p>
            <p style="text-align: center;">
                <a href="https://cistudy-client-2.vercel.app/courses/${courseId}/management" class="button">Go to this course management</a>
            </p>
            <p>Thank you for your understanding and continued support of <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>.</p>
            <p>Best regards,</p>
            Cistudy Support Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
        `

export const acceptInstructorMail = (username: string, email: string) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .header {
                    background-color: #D9D9DB;
                    padding: 10px 20px;
                    color: black;
                    text-align: center;
                }
                .content {
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #777;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>INSTRUCTOR REGISTRATION RESULT</h1>
                </div>
                <div class="content">
                    <h3>Dear ${username ?? email},</h3>
                    <p>We are pleased to inform you that your application to become an instructor on <span style="color: #60A5FA;">Ci</span><span style="color: #116761;">Study</span> has been successfully reviewed and approved.</p>
                    <p>Congratulations! You are now officially an instructor on our platform. You can start creating and managing your courses immediately.</p>
                    <p>We are excited to see the valuable content you will bring to our learners.</p>
                    <p>Should you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
                    <p>Thank you for being a part of <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>.</p>
                    <p>Best regards,</p>
                    CiStudy Support Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
                    <p>This email was sent from an automated system, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `

export const rejectInstructorMail = (username: string, email: string, note: string) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Instructor Application Status on CiStudy</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .header {
                    background-color: #D9D9DB;
                    padding: 10px 20px;
                    color: black;
                    text-align: center;
                }
                .content {
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #777;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 10px 0;
                    color: white;
                    background-color: #60A5FA;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>INSTRUCTOR REGISTRATION RESULT</h1>
                </div>
                <div class="content">
                    <h3>Dear ${username ?? email},</h3>
                    <p>Thank you for your recent application to become an instructor on <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>. We appreciate your effort in wanting to contribute to our learning community.</p>
                    <p>After careful consideration, we regret to inform you that your application does not meet the necessary criteria for approval at this time.</p>
                    ${note ? `
                    <p>Here are some points that you may want to consider for improvement: </p>
                    <ul>
                        <p>${note}</p>
                    </ul>        
                    ` : null}
                    <p>We encourage you to review the feedback and reapply after making the necessary adjustments. We value your commitment and would love to see you succeed as an instructor on our platform.</p>
                    <p>If you have any questions or need further guidance, please feel free to contact our support team.</p>
                    <p>Thank you for your understanding and continued support of <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>.</p>
                    <p>Best regards,</p>
                    CiStudy Support Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 <span style="color: #60A5FA;">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
                    <p>This email was sent from an automated system, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `
export const verifyAccountMail = (username: string, email: string, frontendUrl: string, token: string) => `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
            color: #000 !important;
        }
        .header {
            background-color: #D9D9DB;
            padding: 10px 20px;
            color: black;
            text-align: center;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: #fff !important;
            background-color: #006FEE;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to <strong style="color: #60A5FA;">Ci</strong><strong style="color: #006FEE;">Study</strong>!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>${username ?? email},</strong></p>
            <p>Thank you for registering on the CiStudy online learning platform. You have taken the first step towards expanding your knowledge and skills.</p>
            <p>To complete your registration, please confirm your email by clicking the button below: </p>
            <p style="text-align: center;">
                <a href="${frontendUrl}/verify-registration?token=${token}" class="button">Confirm Email</a>
            </p>
            
            <p>After confirming, you can access your account and start exploring exciting courses on CiStudy.</p>
            <p>If you have any questions or need further assistance, do not hesitate to contact our support team.</p>
            <p>Best regards,</p>
            <p>The CiStudy Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 CiStudy. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
            `

export const newPasswordMail = (email: string, username: string, newPassword: string) => 
    `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
            color: #000 !important;
        }
        .header {
            background-color: #D9D9DB;
            padding: 10px 20px;
            color: black;
            text-align: center;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: #fff !important;
            background-color: #006FEE;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your new password at <strong style="color: #60A5FA;">Ci</strong><strong style="color: #006FEE;">Study</strong></h1>
        </div>
        <div class="content">
            <p>Hello <strong>${username ?? email},</strong></p>
            <p>Your password has been successfully changed for your CiStudy account.</p>
            <p>Here is your new password:</p>
            <p style="font-weight: bold; color: #006FEE;">${newPassword}</p>
            <p>If you did not request this change, please secure your account immediately by contacting our support team or visiting our homepage to change your password again.</p>
            <p>If you have any questions or need further assistance, do not hesitate to contact our support team.</p>
            <p>Best regards,</p>
            <p>The CiStudy Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 CiStudy. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`

export const reportAccountMail = (reporterUsername: string, reportedUsername:string, reportedDate: Date, title: string, description: string, processStatus: string, processNote: string) => `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #006FEE;
            padding: 20px;
            color: white;
            text-align: center;
            font-size: 1.5em;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .highlight {
            color: #60A5FA;
        }
        h1 {
            font-size: 1.5em;
        }
        h3 {
            font-size: 1.2em;
        }
        p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notification of Report Received</h1>
        </div>
        <div class="content">
            <h3>Dear ${reportedUsername},</h3>
            <p>We hope this message finds you well. We are writing to inform you that a report has been submitted regarding your account/activity on <span class="highlight">Ci</span><span style="color: #116761;">Study</span>.</p>

            <h4>Details of the Report:</h4>
            <p><strong>Reported By:</strong> ${reporterUsername}</p>
            <p><strong>Date of Report:</strong> ${reportedDate}</p>
            <p><strong>Reason for Report:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>

            ${processStatus === "approved" ? `
            <h4>Our Actions:</h4>
            <p>${processNote}</p>
            <h4>Recommendations:</h4>
            <p>- Ensure that your activities comply with our community guidelines and terms of service.</p>
            <p>- Refrain from engaging in any retaliatory behavior against the reporting user.</p>
            ` : `
            <h4>Recommendations:</h4>
            <p>- Ensure that your activities comply with our community guidelines and terms of service.</p>
            <p>- Review our guidelines to avoid future reports.</p>
            `}
            
            <p>We take all reports seriously and aim to maintain a safe and respectful environment for all our users. We appreciate your cooperation and understanding during this process.</p>

            <p>If you have any questions or need further clarification, please do not hesitate to contact our support team at <a href="mailto:support@cistudy.com">support@cistudy.com</a>.</p>

            <p>Thank you for your attention to this matter.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>CiStudy Support Team</p>
            <p>support@cistudy.com</p>
            <p>&copy; 2024 <span class="#60A5FA">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`

export const forgotPasswordMail = (email : string, username : string, frontendUrl: string, token : string) => 
    `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
            color: #000 !important;
        }
        .header {
            background-color: #D9D9DB;
            padding: 10px 20px;
            color: black;
            text-align: center;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: #fff !important;
            background-color: #006FEE;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password at <strong style="color: #60A5FA;">Ci</strong><strong style="color: #006FEE;">Study</strong></h1>
        </div>
        <div class="content">
            <p>Hello <strong>${username ?? email},</strong></p>
            <p>We received a request to reset the password for your account at <strong style="color: #60A5FA;">Ci</strong><strong style="color: #006FEE;">Study</strong>.</p>
            <p>If you are attempting to change your password, please click the link below:</p>
            <p style="text-align: center;">
                <a href="${frontendUrl}/reset-password?token=${token}" class="button">Reset Password</a>
            </p>
            <p>If you did not request a password reset, please secure your account by visiting <a href="${frontendUrl}"><strong style="color: #60A5FA;">Ci</strong><strong style="color: #006FEE;">Study</strong></a> and changing your password.</p>
            <p>If you have any questions or need further assistance, do not hesitate to contact our support team.</p>
            <p>Best regards,</p>
            <p>The CiStudy Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 CiStudy. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

    `


export const reportCourseMail = (reportedCourseCreatorEmail: string, reporterUsername: string, courseTitle: string, reportedDate: Date, title: string, description: string, processStatus: string, processNote: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #006FEE;
            padding: 20px;
            color: white;
            text-align: center;
            font-size: 1.5em;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .highlight {
            color: #60A5FA;
        }
        h1 {
            font-size: 1.5em;
        }
        h3 {
            font-size: 1.2em;
        }
        p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notification of Report Received</h1>
        </div>
        <div class="content">
            <h3>Dear ${reportedCourseCreatorEmail},</h3>
            <p>We hope this message finds you well. We are writing to inform you that a report has been submitted regarding your course titled "<strong>${courseTitle}</strong>" on <span class="highlight">Ci</span><span style="color: #116761;">Study</span>.</p>

            <h4>Details of the Report:</h4>
            <p><strong>Reported By:</strong> ${reporterUsername}</p>
            <p><strong>Date of Report:</strong> ${reportedDate}</p>
            <p><strong>Reason for Report:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>

            ${processStatus === "approved" ? `
            <h4>Our Actions:</h4>
            <p>${processNote}</p>
            <h4>Recommendations:</h4>
            <p>- Ensure that your course content complies with our community guidelines and terms of service.</p>
            <p>- Refrain from engaging in any retaliatory behavior against the reporting user.</p>
            ` : `
            <h4>Recommendations:</h4>
            <p>- Ensure that your course content complies with our community guidelines and terms of service.</p>
            <p>- Review our guidelines to avoid future reports.</p>
            `}
            
            <p>We take all reports seriously and aim to maintain a safe and respectful environment for all our users. We appreciate your cooperation and understanding during this process.</p>

            <p>If you have any questions or need further clarification, please do not hesitate to contact our support team at <a href="mailto:support@cistudy.com">support@cistudy.com</a>.</p>

            <p>Thank you for your attention to this matter.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>CiStudy Support Team</p>
            <p>support@cistudy.com</p>
            <p>&copy; 2024 <span class="#60A5FA">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`

export const reportPostMail = (reportedPostCreatorEmail: string, reporterUsername: string, postTitle: string, reportedDate: Date, title: string, description: string, processStatus: string, processNote: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #006FEE;
            padding: 20px;
            color: white;
            text-align: center;
            font-size: 1.5em;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .highlight {
            color: #60A5FA;
        }
        h1 {
            font-size: 1.5em;
        }
        h3 {
            font-size: 1.2em;
        }
        p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notification of Report Received</h1>
        </div>
        <div class="content">
            <h3>Dear ${reportedPostCreatorEmail},</h3>
            <p>We hope this message finds you well. We are writing to inform you that a report has been submitted regarding your post titled "<strong>${postTitle}</strong>" on <span class="highlight">Ci</span><span style="color: #116761;">Study</span>.</p>

            <h4>Details of the Report:</h4>
            <p><strong>Reported By:</strong> ${reporterUsername}</p>
            <p><strong>Date of Report:</strong> ${reportedDate}</p>
            <p><strong>Reason for Report:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>

            ${processStatus === "approved" ? `
            <h4>Our Actions:</h4>
            <p>${processNote}</p>
            <h4>Recommendations:</h4>
            <p>- Ensure that your post content complies with our community guidelines and terms of service.</p>
            <p>- Refrain from engaging in any retaliatory behavior against the reporting user.</p>
            ` : `
            <h4>Recommendations:</h4>
            <p>- Ensure that your post content complies with our community guidelines and terms of service.</p>
            <p>- Review our guidelines to avoid future reports.</p>
            `}
            
            <p>We take all reports seriously and aim to maintain a safe and respectful environment for all our users. We appreciate your cooperation and understanding during this process.</p>

            <p>If you have any questions or need further clarification, please do not hesitate to contact our support team at <a href="mailto:support@cistudy.com">support@cistudy.com</a>.</p>

            <p>Thank you for your attention to this matter.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>CiStudy Support Team</p>
            <p>support@cistudy.com</p>
            <p>&copy; 2024 <span class="#60A5FA">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`
export const reportPostCommentMail = (reportedPostCommentCreatorEmail: string, reporterUsername: string, postCommentContent: string, reportedDate: Date, title: string, description: string, processStatus: string, processNote: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #006FEE;
            padding: 20px;
            color: white;
            text-align: center;
            font-size: 1.5em;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .highlight {
            color: #60A5FA;
        }
        h1 {
            font-size: 1.5em;
        }
        h3 {
            font-size: 1.2em;
        }
        p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notification of Report Received</h1>
        </div>
        <div class="content">
            <h3>Dear ${reportedPostCommentCreatorEmail},</h3>
            <p>We hope this message finds you well. We are writing to inform you that a report has been submitted regarding your comment on a post with the content "<strong>${postCommentContent}</strong>" on <span class="highlight">Ci</span><span style="color: #116761;">Study</span>.</p>

            <h4>Details of the Report:</h4>
            <p><strong>Reported By:</strong> ${reporterUsername}</p>
            <p><strong>Date of Report:</strong> ${reportedDate}</p>
            <p><strong>Reason for Report:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>

            ${processStatus === "approved" ? `
            <h4>Our Actions:</h4>
            <p>${processNote}</p>
            <h4>Recommendations:</h4>
            <p>- Ensure that your comments comply with our community guidelines and terms of service.</p>
            <p>- Refrain from engaging in any retaliatory behavior against the reporting user.</p>
            ` : `
            <h4>Recommendations:</h4>
            <p>- Ensure that your comments comply with our community guidelines and terms of service.</p>
            <p>- Review our guidelines to avoid future reports.</p>
            `}
            
            <p>We take all reports seriously and aim to maintain a safe and respectful environment for all our users. We appreciate your cooperation and understanding during this process.</p>

            <p>If you have any questions or need further clarification, please do not hesitate to contact our support team at <a href="mailto:support@cistudy.com">support@cistudy.com</a>.</p>

            <p>Thank you for your attention to this matter.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>CiStudy Support Team</p>
            <p>support@cistudy.com</p>
            <p>&copy; 2024 <span class="#60A5FA">Ci</span><span style="color: #006FEE;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`
