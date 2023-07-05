function(properties, context) {
    var parseutil = require("mailparser");
    
    // Concise names
    var emailbuffer = Buffer.from(properties.rawemail, "base64");
    var parseoptions = {
        skipHtmlToText: true,
        skipImageLinks: false,
        skipTextToHtml: false,
        skipTextLinks: false,
        keepCidLinks: false
    };
    
    // Parse the buffer
    var promiseparse = parseutil.simpleParser(emailbuffer, parseoptions);
    var parsedemail = context.async(
        callback => promiseparse
        .then(parsed => callback(null, parsed))
        .catch(reason => callback(reason))
    );
    
 	// Send
    return {
        headersubject: !parsedemail.subject ? null : parsedemail.subject,
        headerfrom: !parsedemail.from ? [] : parsedemail.from.value.map(a => a.address),
        headerto: !parsedemail.to ? [] : parsedemail.to.value.map(a => a.address),
        headercc: !parsedemail.cc ? [] : parsedemail.cc.value.map(a => a.address),
        headerbcc: !parsedemail.bcc ? [] : parsedemail.bcc.value.map(a => a.address),
        headerdate: !parsedemail.date ? null : parsedemail.date,
        headermessageid: !parsedemail.messageId ? null : parsedemail.messageId,
        headerinreplyto: !parsedemail.inReplyTo ? null : parsedemail.inReplyTo,
        headerreplyto: !parsedemail.replyTo ? [] : parsedemail.replyTo.value.map(a => a.address),
        bodyhtml: !parsedemail.html ? null : parsedemail.html,
        attachmentnames: !parsedemail.attachments ? [] : parsedemail.attachments.map(a => a.filename || " "),
        attachmenttypes: !parsedemail.attachments ? [] : parsedemail.attachments.map(a => a.contentType || " "),
        attachmentccontents: !parsedemail.attachments ? [] : parsedemail.attachments.map(a => a.content.toString("Base64") || " ")    
    };
}