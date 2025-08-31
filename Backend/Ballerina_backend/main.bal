import ballerina/crypto;
import ballerina/email;
import ballerina/http;
import ballerina/log;
import ballerina/mime;
import ballerina/time;
import ballerina/uuid;
import ballerinax/mongodb;

type NotificationCounter record {
    string userEmail;
    int emailCount;
    string lastEmailSent;
};

type AdminEmailRequest record {
    string title;
    string message;
    string messageType;
    int priority;
    string adminEmail;
};

type ResetNotificationRequest record {
    string userEmail;
};

type AdminMessageDocument record {
    string messageId;
    string title;
    string message;
    string messageType;
    string createdAt;
    string createdBy;
    boolean isActive;
    int priority;
    string[] readByUsers;
};

type CreateMessageRequest record {
    string title;
    string message;
    string messageType;
    int priority;
    string adminEmail;
};

type MarkMessageReadRequest record {
    string userEmail;
    string messageId;
};

configurable string smtpHost = "smtp.gmail.com";
configurable int smtpPort = 587;
configurable string emailUsername = "your-email@gmail.com";
configurable string emailPassword = "your-app-password";
configurable string fromEmail = "your-email@gmail.com";
configurable string fromName = "Your App Name";

configurable string adminUsername = "admin";
configurable string adminPassword = "admin";

email:SmtpConfiguration smtpConfig = {
    port: smtpPort,
    security: email:START_TLS_AUTO
};

type SimpleMessage record {
    string messageId;
    string title;
    string message;
    string messageType;
    string createdAt;
    string createdBy;
    boolean isActive;
    int priority;
    json readByUsers;
};

type NotificationDocument record {
    string title;
    string message;
    string notificationType;
    string createdAt;
    string createdBy;
    boolean isActive;
    int priority;
};

type UserNotificationDocument record {
    string userId;
    string notificationId;
    string? readAt = ();
    boolean isRead;
};

type CreateNotificationRequest record {
    string title;
    string message;
    string notificationType;
    int priority;
    string adminEmail;
};

type MarkNotificationReadRequest record {
    string userEmail;
    string notificationId;
};

type UserDataDocument record {
    string email;
    string username;
    string picture;
    string? pictureId = ();
    string? bio = ();
    string? location = ();
    string? phoneNumber = ();

};

type UserDocument record {
    string email;
    string username;
    string password;
    string? createdAt = ();
    string? lastLogin = ();
    string? authMethod = "local";
    string? googleId = ();
    string? picture = ();
    boolean? emailVerified = false;
    string? unsplashImageId = ();
};

type AdminLoginRequest record {
    string username;
    string password;
};

type AdminDocument record {
    string username;
    string Password;
};

type ProfilePictureUpdate record {
    string email;
    string? pictureUrl;
    string? unsplashImageId;
};

type UserInput record {
    string email;
    string username;
    string password;
};

type LoginRequest record {
    string email;
    string password;
};

type ApiResponse record {
    boolean success;
    string message;
    json? data = ();
};

type PresentationDocument record {
    string userEmail;
    string topic;
    string[] subtopics;
    json slides;
    string createdAt;
    string? thumbnail = ();
    boolean isActive;
};

final email:SmtpClient smtpClient = check new (smtpHost, emailUsername, emailPassword, smtpConfig);

function createWelcomeEmailHtml(string username, string userEmail, string profilePictureUrl) returns string {
    return string `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Webify.me!</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        /* General Styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #f0f2f5;
            font-family: 'Poppins', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f0f2f5;
            padding: 40px 0;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        td {
            padding: 0;
        }
        p {
            margin: 0 0 16px 0;
            line-height: 1.6;
            color: #555;
        }
        a {
            color:#00aeff;
            text-decoration: none;
        }
        /* Header */
        .header {
            background: linear-gradient(135deg, #00aeff, #81d4fa);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        /* Content */
        .content {
            padding: 40px 30px;
        }
        .welcome-text {
            font-size: 22px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        /* Features Section */
        .features {
            background-color: #f8f9fa;
            border-left: 4px solid  #00aeff;
            padding: 20px;
            margin: 30px 0;
        }
        .features h3 {
            margin-top: 0;
            color: #333;
        }
        .features ul {
            margin: 0;
            padding-left: 20px;
            list-style-type: '⁘  ';
        }
        .features li {
            padding-left: 10px;
            margin-bottom: 10px;
            color: #555;
        }
        /* Button */
        .button-wrapper {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            background: linear-gradient(135deg,  #00aeff, #81d4fa);
            color: #ffffff;
            padding: 15px 35px;
            border-radius: 50px;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(106, 90, 205, 0.4);
        }
        /* Footer */
        .footer {
            background-color: #f0f2f5;
            text-align: center;
            padding: 30px;
            font-size: 12px;
            color: #888;
        }
        .socials a {
            margin: 0 8px;
            display: inline-block;
        }
        .socials img {
            width: 24px;
            height: 24px;
        }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main" width="100%">
            <!-- Header -->
            <tr>
                <td>
                    <table class="header" width="100%">
                        <tr>
                            <td>
                                <h1>Welcome to Webify.me!</h1>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <!-- Content -->
            <tr>
                <td class="content">
                    <p class="welcome-text">Hi ${username},</p>
                    <p>We're thrilled to have you on board! Your account has been successfully created, and you're just one step away from bringing your ideas to life.</p>
                    
                    <div class="features">
                        <h3>Here's a glimpse of what you can do:</h3>
                        <ul>
                            <li>Build stunning, responsive websites in minutes.</li>
                            <li>Customize every detail with our intuitive live editor.</li>
                            <li>Bring your vision to life with AI-powered design.</li>
                            <li>Download your complete website with a single click.</li>
                        </ul>
                    </div>
                    
                    <table class="button-wrapper" width="100%">
                        <tr>
                            <td>
                                <a href="https://presentation-generator-pi.vercel.app/login" target="_blank" class="button">Start Creating Now</a>
                            </td>
                        </tr>
                    </table>
                    
                    <p>If you have any questions or need a hand getting started, don't hesitate to reach out to our support team. We're here to help!</p>
                    <p>Happy creating,<br>The ${fromName} Team</p>
                </td>
            </tr>
            <!-- Footer -->
            <tr>
                <td class="footer">
                    <p>© 2025 Webify.me. All rights reserved.</p>
                    
                </td>
            </tr>
        </table>
    </center>
</body>
</html>

    `;
}

function sendWelcomeEmail(string toEmail, string username, string profilePictureUrl) returns error? {
    log:printInfo("📧 Sending welcome email to: " + toEmail);

    email:Message emailMessage = {
        to: [toEmail],
        subject: "🎉 Welcome to " + fromName + "!",
        body: createWelcomeEmailHtml(username, toEmail, profilePictureUrl),
        'from: fromEmail,
        contentType: mime:TEXT_HTML
    };

    email:Error? result = smtpClient->sendMessage(emailMessage);

    if result is email:Error {
        log:printError("❌ Failed to send email", 'error = result);
        return result;
    } else {
        log:printInfo("✅ Welcome email sent successfully");
    }
}

function sendNotificationEmail(string toEmail, string username, string title, string message, string messageType) returns error? {
    log:printInfo("📧 Sending notification email to: " + toEmail);

    string typeEmoji = getMessageTypeEmoji(messageType);

    string emailHtml = string `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; color: #667eea; }
            .message-type { padding: 10px 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
            .type-info { background: #e3f2fd; color: #1976d2; }
            .type-success { background: #e8f5e9; color: #388e3c; }
            .type-warning { background: #fff3e0; color: #f57c00; }
            .type-error { background: #ffebee; color: #d32f2f; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${title}</h1>
            </div>
            
            <p>Hi <strong>${username}</strong>,</p>
            
            <div class="message-type type-${messageType}">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
            
            <p>This is an important notification from ${fromName}. Please log in to your account for more details.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://presentation-generator-pi.vercel.app/login" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Login to Your Account →
                </a>
            </div>
            
            <div class="footer">
                <p>Thank you,<br>${fromName} Team</p>
                <p style="font-size: 12px; color: #999;">
                    This email was sent to ${toEmail}. 
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    email:Message emailMessage = {
        to: [toEmail],
        subject: typeEmoji + " " + title + " - " + fromName,
        body: emailHtml,
        'from: fromEmail,
        contentType: mime:TEXT_HTML
    };

    email:Error? result = smtpClient->sendMessage(emailMessage);

    if result is email:Error {
        log:printError("❌ Failed to send notification email to " + toEmail, 'error = result);
        return result;
    } else {
        log:printInfo("✅ Notification email sent successfully to: " + toEmail);
    }
}

function getMessageTypeEmoji(string messageType) returns string {
    match messageType {
        "success" => {
            return "✅";
        }
        "warning" => {
            return "⚠️";
        }
        "error" => {
            return "❌";
        }
        "info" => {
            return "ℹ️";
        }
        _ => {
            return "📢";
        }
    }
}

final http:Client loremPicsumClient = check new ("https://picsum.photos");

configurable string host = "localhost";
configurable int port = 27017;
configurable string database = "userDb";

final mongodb:Client mongoClient = check new ({
    connection: {
        serverAddress: {
            host: host,
            port: port
        }
    }
});

function extractTokenFromHeader(string|http:HeaderNotFoundError authHeaderResult) returns string|error {
    if authHeaderResult is http:HeaderNotFoundError {
        return error("Authorization header is missing");
    }

    string authHeader = authHeaderResult;
    if !authHeader.startsWith("Bearer ") {
        return error("Invalid authorization header format");
    }

    return authHeader.substring(7);
}

@http:ServiceConfig {
    cors: {
        allowOrigins: ["https://presentation-generator-pi.vercel.app"],
        allowCredentials: false,
        allowHeaders: ["Content-Type"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}

service / on new http:Listener(9090) {

    resource function get test() returns json {
        log:printInfo("Test endpoint called");
        return {
            status: "OK",
            message: "Backend is running",
            timestamp: time:utcToString(time:utcNow())
        };
    }

    resource function post admin/login(@http:Payload AdminLoginRequest loginRequest) returns ApiResponse|error {
        log:printInfo("=== ADMIN LOGIN REQUEST ===");

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection adminCollection = check userDb->getCollection("admin");

        // Find the admin user by username
        map<json> filter = {"username": loginRequest.username};
        AdminDocument? adminUser = check adminCollection->findOne(filter);

        if adminUser is AdminDocument {
            // Check if the password matches
            if adminUser.Password == loginRequest.password {
                log:printInfo("✅ Admin login successful for: " + loginRequest.username);
                return {
                    success: true,
                    message: "Admin login successful"
                };
            }
        }

        log:printWarn("Admin login failed for: " + loginRequest.username);
        return {
            success: false,
            message: "Invalid username or password"
        };
    }

    resource function post signup(@http:Payload UserInput user) returns ApiResponse|error {
        log:printInfo("=== REGULAR SIGNUP REQUEST ===");
        log:printInfo("Email: " + user.email);
        log:printInfo("Username: " + user.username);

        if user.email.length() == 0 || user.username.length() == 0 || user.password.length() == 0 {
            return {success: false, message: "All fields are required"};
        }

        if user.password.length() < 6 {
            return {success: false, message: "Password must be at least 6 characters long"};
        }

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        int emailCount = check usersCollection->countDocuments({"email": user.email});
        if emailCount > 0 {
            return {success: false, message: "Email already exists"};
        }

        int usernameCount = check usersCollection->countDocuments({"username": user.username});
        if usernameCount > 0 {
            return {success: false, message: "Username already exists"};
        }

        byte[] hashedPassword = crypto:hashSha256(user.password.toBytes());
        string hashedPasswordStr = hashedPassword.toBase64();
        string currentTime = time:utcToString(time:utcNow());

        byte[] emailHash = crypto:hashSha256(user.email.toBytes());
        string emailHashStr = emailHash.toBase64();
        string pictureId = emailHashStr.substring(0, 8);
        string profilePictureUrl = "https://picsum.photos/300/300?random=" + pictureId;

        map<json> newUserDoc = {
            "email": user.email,
            "username": user.username,
            "password": hashedPasswordStr,
            "createdAt": currentTime,
            "picture": profilePictureUrl,
            "pictureId": pictureId,
            "emailVerified": false
        };

        map<json> newUserDataDoc = {
            "email": user.email,
            "username": user.username,
            "picture": profilePictureUrl,
            "pictureId": pictureId
        };

        mongodb:Error? insertResult = usersCollection->insertOne(newUserDoc);
        if insertResult is mongodb:Error {
            return {success: false, message: "Failed to create user"};
        }

        mongodb:Error? userDataInsertResult = userDataCollection->insertOne(newUserDataDoc);
        if userDataInsertResult is mongodb:Error {

            mongodb:DeleteResult|mongodb:Error deleteResult = usersCollection->deleteOne({"email": user.email});
            if deleteResult is mongodb:Error {
                log:printWarn("Failed to rollback user creation: " + deleteResult.message());
            }
            return {success: false, message: "Failed to create user data"};
        }

        error? emailResult = sendWelcomeEmail(user.email, user.username, profilePictureUrl);
        if emailResult is error {
            log:printWarn("Failed to send welcome email, but user created successfully");
        }

        log:printInfo("✅ User registered successfully: " + user.username);

        return {
            success: true,
            message: "User registered successfully! Check your email for welcome message.",
            data: {
                email: user.email,
                username: user.username,
                picture: profilePictureUrl,
                pictureId: pictureId
            }
        };
    }

    resource function get checkUsername/[string username]() returns ApiResponse|error {
        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");

        int count = check usersCollection->countDocuments({"username": username});

        return {
            success: true,
            message: count > 0 ? "Username exists" : "Username available",
            data: {
                exists: count > 0
            }
        };
    }

    resource function post login(@http:Payload LoginRequest credentials) returns ApiResponse|error {
        log:printInfo("=== LOGIN REQUEST ===");
        log:printInfo("Email: " + credentials.email);

        if credentials.email.length() == 0 || credentials.password.length() == 0 {
            log:printWarn("Login validation failed: Empty fields");
            return {
                success: false,
                message: "Email and password are required"
            };
        }

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        map<json> filter = {"email": credentials.email};
        mongodb:FindOptions findOptions = {};
        stream<UserDocument, mongodb:Error?> userStream = check usersCollection->find(filter, findOptions);

        UserDocument[] users = check from UserDocument doc in userStream
            select doc;

        if users.length() == 0 {
            log:printWarn("Login failed: User not found - " + credentials.email);
            return {
                success: false,
                message: "Invalid email or password"
            };
        }

        UserDocument user = users[0];

        byte[] hashedPassword = crypto:hashSha256(credentials.password.toBytes());
        string hashedPasswordStr = hashedPassword.toBase64();

        if user.password == hashedPasswordStr {
            log:printInfo("✅ Login successful for user: " + credentials.email);

            string currentTime = time:utcToString(time:utcNow());
            mongodb:Update updateDoc = {
                set: {
                    "lastLogin": currentTime
                }
            };

            mongodb:UpdateResult|mongodb:Error updateResult = usersCollection->updateOne(filter, updateDoc);
            if updateResult is mongodb:Error {
                log:printWarn("Failed to update last login time: " + updateResult.message());
            }

            stream<UserDataDocument, mongodb:Error?> userDataStream = check userDataCollection->find(filter, findOptions);
            UserDataDocument[] userDataList = check from UserDataDocument doc in userDataStream
                select doc;

            json profileData = {};
            if userDataList.length() > 0 {
                UserDataDocument userDataDoc = userDataList[0];
                profileData = {
                    picture: userDataDoc.picture,
                    bio: userDataDoc?.bio,
                    location: userDataDoc?.location,
                    phoneNumber: userDataDoc?.phoneNumber
                };
            }

            return {
                success: true,
                message: "Login successful",
                data: {
                    email: user.email,
                    username: user.username,
                    loginTime: currentTime,
                    profile: profileData
                }
            };
        } else {
            log:printWarn("Login failed: Invalid password for user - " + credentials.email);
            return {
                success: false,
                message: "Invalid email or password"
            };
        }
    }

    resource function post admin/messages(@http:Payload CreateMessageRequest messageData) returns ApiResponse|error {
        log:printInfo("=== CREATE ADMIN MESSAGE REQUEST ===");
        log:printInfo("Title: " + messageData.title);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection adminMessagesCollection = check userDb->getCollection("adminMessages");

        string currentTime = time:utcToString(time:utcNow());
        string messageId = uuid:createType1AsString();

        map<json> newMessageDoc = {
            "messageId": messageId,
            "title": messageData.title,
            "message": messageData.message,
            "messageType": messageData.messageType,
            "createdAt": currentTime,
            "createdBy": messageData.adminEmail,
            "isActive": true,
            "priority": messageData.priority
        };

        mongodb:Error? insertResult = adminMessagesCollection->insertOne(newMessageDoc);

        if insertResult is mongodb:Error {
            log:printError("Failed to create admin message", 'error = insertResult);
            return {
                success: false,
                message: "Failed to create message"
            };
        }

        log:printInfo("✅ Admin message created successfully with ID: " + messageId);

        return {
            success: true,
            message: "Message sent to all users successfully!",
            data: {
                messageId: messageId
            }
        };
    }

    resource function post storePresentation(@http:Payload json requestData) returns ApiResponse|error {
        log:printInfo("=== STORE PRESENTATION ===");

        json|error userEmailValue = requestData.userEmail;
        json|error presentationValue = requestData.presentation;

        if !(userEmailValue is string) || !(presentationValue is json) {
            return {
                success: false,
                message: "Invalid request data"
            };
        }

        string userEmail = userEmailValue;
        json presentation = presentationValue;

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection presentationsCollection = check userDb->getCollection("presentations");

        string currentTime = time:utcToString(time:utcNow());

        map<json> presentationDoc = {
            "userEmail": userEmail,
            "topic": check presentation.topic,
            "subtopics": check presentation.subtopics,
            "slides": check presentation.slides,
            "createdAt": currentTime,
            "isActive": true
        };

        mongodb:Error? insertResult = presentationsCollection->insertOne(presentationDoc);

        if insertResult is mongodb:Error {
            log:printError("Failed to store presentation", 'error = insertResult);
            return {
                success: false,
                message: "Failed to store presentation"
            };
        }

        log:printInfo("✅ Presentation stored successfully");

        return {
            success: true,
            message: "Presentation stored successfully",
            data: {
                id: presentationDoc["_id"]
            }
        };
    }

    resource function get getUserPresentations/[string userEmail]() returns ApiResponse|error {
        log:printInfo("=== GET USER PRESENTATIONS ===");
        log:printInfo("User: " + userEmail);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection presentationsCollection = check userDb->getCollection("presentations");

        map<json> filter = {"userEmail": userEmail, "isActive": true};
        mongodb:FindOptions findOptions = {
            sort: {createdAt: -1}
        };

        stream<map<json>, mongodb:Error?> presentationStream = check presentationsCollection->find(filter, findOptions);

        json[] presentations = [];
        error? e = presentationStream.forEach(function(map<json> doc) {
            presentations.push({
                "_id": doc["_id"],
                "topic": doc["topic"],
                "subtopics": doc["subtopics"],
                "createdAt": doc["createdAt"],
                "thumbnail": doc["thumbnail"]
            });
        });

        if e is error {
            log:printError("Error processing presentation stream", 'error = e);
            return {
                success: false,
                message: "Failed to process presentations"
            };
        }

        log:printInfo("Found " + presentations.length().toString() + " presentations");

        return {
            success: true,
            message: "Presentations retrieved successfully",
            data: presentations
        };
    }

    resource function delete deletePresentation/[string presentationId](@http:Payload json requestData) returns ApiResponse|error {
        log:printInfo("=== DELETE PRESENTATION ===");
        log:printInfo("Presentation ID: " + presentationId);

        json|error userEmailValue = requestData.userEmail;
        if !(userEmailValue is string) {
            return {
                success: false,
                message: "Invalid request data"
            };
        }

        string userEmail = userEmailValue;

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection presentationsCollection = check userDb->getCollection("presentations");

        map<json> filter = {"_id": presentationId, "userEmail": userEmail};
        mongodb:Update updateDoc = {
            set: {"isActive": false}
        };

        mongodb:UpdateResult|mongodb:Error updateResult = presentationsCollection->updateOne(filter, updateDoc);

        if updateResult is mongodb:Error {
            log:printError("Failed to delete presentation", 'error = updateResult);
            return {
                success: false,
                message: "Failed to delete presentation"
            };
        }

        log:printInfo("✅ Presentation deleted successfully");

        return {
            success: true,
            message: "Presentation deleted successfully"
        };
    }

    resource function put renamePresentation/[string presentationId](@http:Payload json requestData) returns ApiResponse|error {
        log:printInfo("=== RENAME PRESENTATION ===");
        log:printInfo("Presentation ID: " + presentationId);

        json|error userEmailValue = requestData.userEmail;
        json|error newTitleValue = requestData.newTitle;

        if !(userEmailValue is string) || !(newTitleValue is string) {
            return {
                success: false,
                message: "Invalid request data"
            };
        }

        string userEmail = userEmailValue;
        string newTitle = newTitleValue;

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection presentationsCollection = check userDb->getCollection("presentations");

        map<json> filter = {"_id": presentationId, "userEmail": userEmail};
        mongodb:Update updateDoc = {
            set: {"topic": newTitle}
        };

        mongodb:UpdateResult|mongodb:Error updateResult = presentationsCollection->updateOne(filter, updateDoc);

        if updateResult is mongodb:Error {
            log:printError("Failed to rename presentation", 'error = updateResult);
            return {
                success: false,
                message: "Failed to rename presentation"
            };
        }

        log:printInfo("✅ Presentation renamed successfully");

        return {
            success: true,
            message: "Presentation renamed successfully"
        };
    }

    resource function get getPresentation/[string presentationId]/[string userEmail]() returns ApiResponse|error {
        log:printInfo("=== GET SINGLE PRESENTATION ===");
        log:printInfo("Presentation ID: " + presentationId);
        log:printInfo("User: " + userEmail);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection presentationsCollection = check userDb->getCollection("presentations");

        map<json> filter = {"_id": presentationId, "userEmail": userEmail, "isActive": true};
        mongodb:FindOptions findOptions = {};

        stream<map<json>, mongodb:Error?> presentationStream = check presentationsCollection->find(filter, findOptions);

        map<json>[] presentations = [];
        error? e = presentationStream.forEach(function(map<json> doc) {
            presentations.push(doc);
        });

        if e is error {
            log:printError("Error processing presentation stream", 'error = e);
            return {
                success: false,
                message: "Failed to process presentation"
            };
        }

        if presentations.length() == 0 {
            return {
                success: false,
                message: "Presentation not found"
            };
        }

        map<json> presentation = presentations[0];

        return {
            success: true,
            message: "Presentation retrieved successfully",
            data: {
                topic: presentation["topic"],
                subtopics: presentation["subtopics"],
                slides: presentation["slides"],
                createdAt: presentation["createdAt"]
            }
        };
    }

    resource function get users() returns ApiResponse|error {
        log:printInfo("Fetching all users");

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");

        map<json> filter = {};
        mongodb:FindOptions findOptions = {};
        stream<UserDocument, mongodb:Error?> userStream = check usersCollection->find(filter, findOptions);

        json[] users = check from UserDocument user in userStream
            select {
                email: user.email,
                username: user.username,
                createdAt: user?.createdAt,
                lastLogin: user?.lastLogin
            };

        log:printInfo("Found " + users.length().toString() + " users");

        return {
            success: true,
            message: "Users retrieved successfully",
            data: users
        };
    }

    resource function get notifications/[string userEmail]() returns ApiResponse|error {
        log:printInfo("=== OLD NOTIFICATION ENDPOINT - REDIRECTING ===");
        log:printInfo("User: " + userEmail);

        json[] testMessages = [
            {
                "id": "test-1",
                "title": "Welcome to Our Platform!",
                "message": "Thank you for joining us. We're excited to have you on board!",
                "type": "success",
                "createdAt": time:utcToString(time:utcNow()),
                "priority": 2
            },
            {
                "id": "test-2",
                "title": "System Maintenance",
                "message": "We will be performing scheduled maintenance tonight from 2 AM to 4 AM.",
                "type": "warning",
                "createdAt": time:utcToString(time:utcNow()),
                "priority": 3
            }
        ];

        return {
            success: true,
            message: "Notifications retrieved successfully",
            data: {
                notifications: testMessages,
                count: testMessages.length()
            }
        };
    }

    resource function delete user/[string email]() returns ApiResponse|error {
        log:printInfo("Delete user request for: " + email);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");

        map<json> filter = {"email": email};
        mongodb:DeleteResult|mongodb:Error deleteResult = usersCollection->deleteOne(filter);

        if deleteResult is mongodb:Error {
            log:printError("Failed to delete user", 'error = deleteResult);
            return {
                success: false,
                message: "Failed to delete user"
            };
        }

        if deleteResult.deletedCount > 0 {
            log:printInfo("✅ User deleted successfully: " + email);
            return {
                success: true,
                message: "User deleted successfully"
            };
        } else {
            log:printWarn("User not found for deletion: " + email);
            return {
                success: false,
                message: "User not found"
            };
        }
    }

    resource function get checkEmail/[string email]() returns ApiResponse|error {
        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");

        int count = check usersCollection->countDocuments({"email": email});

        return {
            success: true,
            message: count > 0 ? "Email exists" : "Email available",
            data: {
                exists: count > 0
            }
        };
    }

    resource function get randomProfilePicture() returns json|error {
        string imageUrl = "https://picsum.photos/200/300";
        return {
            success: true,
            message: "Random profile picture retrieved",
            data: {
                url: imageUrl
            }
        };
    }

    resource function put updateProfilePicture(@http:Payload ProfilePictureUpdate updateData) returns ApiResponse|error {
        log:printInfo("Profile picture update request for: " + updateData.email);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        int userCount = check usersCollection->countDocuments({"email": updateData.email});
        if userCount == 0 {
            return {
                success: false,
                message: "User  not found"
            };
        }

        map<json> updateFields = {
            "picture": updateData.pictureUrl
        };

        mongodb:Update updateDoc = {
            set: updateFields
        };

        mongodb:UpdateResult|mongodb:Error updateResult = usersCollection->updateOne({"email": updateData.email}, updateDoc);

        if updateResult is mongodb:Error {
            log:printError("Failed to update profile picture in users collection", 'error = updateResult);
            return {
                success: false,
                message: "Failed to update profile picture"
            };
        }

        mongodb:UpdateResult|mongodb:Error userDataUpdateResult = userDataCollection->updateOne(
        {"email": updateData.email},
        {set: {"picture": updateData.pictureUrl}}
        );

        if userDataUpdateResult is mongodb:Error {
            log:printError("Failed to update profile picture in userData collection", 'error = userDataUpdateResult);
            return {
                success: false,
                message: "Failed to update profile picture in user data"
            };
        }

        log:printInfo("✅ Profile picture updated successfully for: " + updateData.email);

        return {
            success: true,
            message: "Profile picture updated successfully"
        };
    }

    resource function get profilePictureOptions/[int count]() returns json|error {
        json[] images = [];

        foreach int i in 0 ..< count {

            json imageData = {
                "id": i.toString(),
                "urls": {
                    "small": "https://picsum.photos/150/150?random=" + i.toString(),
                    "regular": "https://picsum.photos/300/300?random=" + i.toString(),
                    "full": "https://picsum.photos/500/500?random=" + i.toString()
                },
                "user": {
                    "name": "Lorem Picsum"
                }
            };

            images.push(imageData);
        }

        return {
            success: true,
            message: "Profile picture options retrieved",
            data: images
        };
    }

    resource function get userProfile/[string email]() returns ApiResponse|error {
        log:printInfo("=== GET USER PROFILE REQUEST ===");
        log:printInfo("Email: " + email);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        map<json> filter = {"email": email};
        mongodb:FindOptions findOptions = {};
        stream<UserDataDocument, mongodb:Error?> userDataStream = check userDataCollection->find(filter, findOptions);

        UserDataDocument[] userDataList = check from UserDataDocument doc in userDataStream
            select doc;

        if userDataList.length() == 0 {
            log:printWarn("User profile not found: " + email);
            return {
                success: false,
                message: "User profile not found"
            };
        }

        UserDataDocument userDataDoc = userDataList[0];

        return {
            success: true,
            message: "User profile retrieved successfully",
            data: {
                email: userDataDoc.email,
                username: userDataDoc.username,
                picture: userDataDoc.picture,
                bio: userDataDoc?.bio,
                location: userDataDoc?.location,
                phoneNumber: userDataDoc?.phoneNumber
            }
        };
    }

    resource function put updateUserProfile(@http:Payload json profileData) returns ApiResponse|error {
        log:printInfo("=== UPDATE USER PROFILE REQUEST ===");

        json|error emailValue = profileData.email;
        if !(emailValue is string) {
            return {
                success: false,
                message: "Email is required"
            };
        }

        string email = emailValue;
        log:printInfo("Email: " + email);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        int userCount = check userDataCollection->countDocuments({"email": email});
        if userCount == 0 {
            return {
                success: false,
                message: "User profile not found"
            };
        }

        map<json> updateFields = {};

        mongodb:Update updateDoc = {
            set: updateFields
        };

        mongodb:UpdateResult|mongodb:Error updateResult = userDataCollection->updateOne(
        {"email": email},
        updateDoc
        );

        if updateResult is mongodb:Error {
            log:printError("Failed to update user profile", 'error = updateResult);
            return {
                success: false,
                message: "Failed to update user profile"
            };
        }

        log:printInfo("✅ User profile updated successfully for: " + email);

        return {
            success: true,
            message: "User profile updated successfully"
        };
    }

    resource function get allUserData() returns ApiResponse|error {
        log:printInfo("Fetching all user data");

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        map<json> filter = {};
        mongodb:FindOptions findOptions = {};
        stream<UserDataDocument, mongodb:Error?> userDataStream = check userDataCollection->find(filter, findOptions);

        json[] userData = check from UserDataDocument userDoc in userDataStream
            select {
                email: userDoc.email,
                username: userDoc.username,
                picture: userDoc.picture,
                bio: userDoc?.bio,
                location: userDoc?.location,
                phoneNumber: userDoc?.phoneNumber
            };

        log:printInfo("Found " + userData.length().toString() + " user profiles");

        return {
            success: true,
            message: "User data retrieved successfully",
            data: userData
        };
    }

    resource function delete userProfile/[string email]() returns ApiResponse|error {
        log:printInfo("Delete user profile request for: " + email);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        map<json> filter = {"email": email};
        mongodb:DeleteResult|mongodb:Error deleteResult = userDataCollection->deleteOne(filter);

        if deleteResult is mongodb:Error {
            log:printError("Failed to delete user profile", 'error = deleteResult);
            return {
                success: false,
                message: "Failed to delete user profile"
            };
        }

        if deleteResult.deletedCount > 0 {
            log:printInfo("✅ User profile deleted successfully: " + email);
            return {
                success: true,
                message: "User profile deleted successfully"
            };
        } else {
            log:printWarn("User profile not found for deletion: " + email);
            return {
                success: false,
                message: "User profile not found"
            };
        }
    }

    resource function get checkUserProfile/[string email]() returns ApiResponse|error {
        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection userDataCollection = check userDb->getCollection("userData");

        int count = check userDataCollection->countDocuments({"email": email});

        return {
            success: true,
            message: count > 0 ? "User profile exists" : "User profile not found",
            data: {
                exists: count > 0,
                email: email
            }
        };
    }

    resource function get admin/notifications() returns ApiResponse|error {
        log:printInfo("=== GET ALL NOTIFICATIONS (ADMIN) ===");

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection notificationsCollection = check userDb->getCollection("notifications");

        map<json> filter = {};

        mongodb:FindOptions findOptions = {
            sort: {createdAt: -1}
        };

        stream<record {|
            string title;
            string message;
            string notificationType;
            string createdAt;
            string createdBy;
            boolean isActive;
            int priority;
        |}, error?> notificationStream = check notificationsCollection->find(filter, findOptions);

        json[] notifications = [];
        check notificationStream.forEach(function(record {|
                    string title;
                    string message;
                    string notificationType;
                    string createdAt;
                    string createdBy;
                    boolean isActive;
                    int priority;
                |} doc) {
            notifications.push({
                "title": doc.title,
                "message": doc.message,
                "type": doc.notificationType,
                "createdAt": doc.createdAt,
                "createdBy": doc.createdBy,
                "isActive": doc.isActive,
                "priority": doc.priority
            });
        });

        log:printInfo("Found " + notifications.length().toString() + " total notifications");

        return {
            success: true,
            message: "All notifications retrieved",
            data: notifications
        };
    }

    resource function get test/notifications() returns ApiResponse|error {
        log:printInfo("=== TEST NOTIFICATIONS IN DATABASE ===");

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection notificationsCollection = check userDb->getCollection("notifications");

        int|mongodb:Error totalCount = notificationsCollection->countDocuments({});

        if totalCount is mongodb:Error {
            return {
                success: false,
                message: "Error counting notifications"
            };
        }

        stream<map<json>, error?> notificationStream = check notificationsCollection->find({}, {});

        json[] allNotifications = [];
        error? e = notificationStream.forEach(function(map<json> doc) {
            allNotifications.push(doc);
        });

        if e is error {
            log:printError("Error processing notification stream", 'error = e);
            return {
                success: false,
                message: "Failed to process notifications"
            };
        }

        return {
            success: true,
            message: "Database test completed",
            data: {
                totalNotifications: totalCount,
                notifications: allNotifications
            }
        };
    }

    resource function post admin/sendEmailNotification(@http:Payload AdminEmailRequest emailData) returns ApiResponse|error {
        log:printInfo("=== SEND EMAIL NOTIFICATION TO ALL USERS ===");
        log:printInfo("Title: " + emailData.title);
        log:printInfo("Admin: " + emailData.adminEmail);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection usersCollection = check userDb->getCollection("users");
        mongodb:Collection notificationCounterCollection = check userDb->getCollection("notificationCounter");

        map<json> filter = {};
        mongodb:FindOptions findOptions = {};

        stream<UserDocument, mongodb:Error?> userStream = check usersCollection->find(filter, findOptions);
        UserDocument[] allUsers = check from UserDocument user in userStream
            select user;

        string currentTime = time:utcToString(time:utcNow());
        int successCount = 0;
        int errorCount = 0;

        foreach UserDocument user in allUsers {

            error? emailResult = sendNotificationEmail(user.email, user.username, emailData.title, emailData.message, emailData.messageType);

            if emailResult is error {
                log:printError("Failed to send email to: " + user.email, 'error = emailResult);
                errorCount += 1;
            } else {
                log:printInfo("✅ Email sent successfully to: " + user.email);
                successCount += 1;

                map<json> counterFilter = {"userEmail": user.email};

                int|mongodb:Error existingCount = notificationCounterCollection->countDocuments(counterFilter);

                if existingCount is int && existingCount > 0 {

                    mongodb:Update updateDoc = {
                        inc: {"emailCount": 1},
                        set: {"lastEmailSent": currentTime}
                    };

                    mongodb:UpdateResult|mongodb:Error updateResult = notificationCounterCollection->updateOne(counterFilter, updateDoc);
                    if updateResult is mongodb:Error {
                        log:printWarn("Failed to update counter for: " + user.email);
                    }
                } else {

                    map<json> newCounter = {
                        "userEmail": user.email,
                        "emailCount": 1,
                        "lastEmailSent": currentTime
                    };

                    mongodb:Error? insertResult = notificationCounterCollection->insertOne(newCounter);
                    if insertResult is mongodb:Error {
                        log:printWarn("Failed to create counter for: " + user.email);
                    }
                }
            }
        }

        log:printInfo("📧 Email notification completed. Success: " + successCount.toString() + ", Errors: " + errorCount.toString());

        return {
            success: true,
            message: "Email notification sent to " + successCount.toString() + " users successfully!",
            data: {
                totalUsers: allUsers.length(),
                successCount: successCount,
                errorCount: errorCount
            }
        };
    }

    resource function get notifications/count/[string userEmail]() returns ApiResponse|error {
        log:printInfo("=== GET NOTIFICATION COUNT ===");
        log:printInfo("User: " + userEmail);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection notificationCounterCollection = check userDb->getCollection("notificationCounter");

        map<json> filter = {"userEmail": userEmail};

        stream<NotificationCounter, mongodb:Error?> counterStream = check notificationCounterCollection->find(filter, {});
        NotificationCounter[] counters = check from NotificationCounter counter in counterStream
            select counter;

        int emailCount = 0;
        string lastEmailSent = "";

        if counters.length() > 0 {
            emailCount = counters[0].emailCount;
            lastEmailSent = counters[0].lastEmailSent;
        }

        return {
            success: true,
            message: "Notification count retrieved",
            data: {
                emailCount: emailCount,
                lastEmailSent: lastEmailSent
            }
        };
    }

    resource function post notifications/reset(@http:Payload ResetNotificationRequest resetData) returns ApiResponse|error {
        log:printInfo("=== RESET NOTIFICATION COUNT ===");
        log:printInfo("User: " + resetData.userEmail);

        mongodb:Database userDb = check mongoClient->getDatabase(database);
        mongodb:Collection notificationCounterCollection = check userDb->getCollection("notificationCounter");

        map<json> filter = {"userEmail": resetData.userEmail};

        mongodb:Update updateDoc = {
            set: {"emailCount": 0}
        };

        mongodb:UpdateResult|mongodb:Error updateResult = notificationCounterCollection->updateOne(filter, updateDoc);

        if updateResult is mongodb:Error {
            log:printError("Failed to reset notification count", 'error = updateResult);
            return {
                success: false,
                message: "Failed to reset notification count"
            };
        }

        log:printInfo("✅ Notification count reset successfully");

        return {
            success: true,
            message: "Notification count reset successfully"
        };
    }

}

