async function(properties, context) {
    const parseutil = require("mailparser");
    
    // Concise names
    const emailbuffer = Buffer.from(properties.rawemail, "base64");
    const parseoptions = {
        skipHtmlToText: true,
        skipImageLinks: false,
        skipTextToHtml: false,
        skipTextLinks: false,
        keepCidLinks: false
    };
    
    // Parse the buffer
    const promiseparse = parseutil.simpleParser(emailbuffer, parseoptions)
    .then(
        (parsed) => {
        	return {
                headersubject: !parsed.subject ? null : parsed.subject,
                headerfrom: !parsed.from ? [] : parsed.from.value.map(a => a.address),
                headerto: !parsed.to ? [] : parsed.to.value.map(a => a.address),
                headercc: !parsed.cc ? [] : parsed.cc.value.map(a => a.address),
                headerbcc: !parsed.bcc ? [] : parsed.bcc.value.map(a => a.address),
                headerdate: !parsed.date ? null : parsed.date,
                headermessageid: !parsed.messageId ? null : parsed.messageId,
                headerinreplyto: !parsed.inReplyTo ? null : parsed.inReplyTo,
                headerreplyto: !parsed.replyTo ? [] : parsed.replyTo.value.map(a => a.address),
                bodyhtml: !parsed.html ? null : parsed.html,
                attachmentnames: !parsed.attachments ? [] : parsed.attachments.map(a => a.filename || " "),
                attachmenttypes: !parsed.attachments ? [] : parsed.attachments.map(a => a.contentType || " "),
                attachmentccontents: !parsed.attachments ? [] : parsed.attachments.map(a => a.content.toString("Base64") || " ")    
            };
        }
    );
    
 	// Send
    return promiseparse;
}