function doObfuscate(theform) {
    if (theform.code.value == "") { alert("No document HTML source code inserted to obfuscate!"); return false; } else {
        enctext = encrypt(theform.code.value);
        ObfuscateToPrint = "<script language=\"javascript\">\n";
        ObfuscateToPrint += "<!--\n";
        ObfuscateToPrint += "\/\/ == Begin Free HTML Source Code Obfuscation Protection from https://snapbuilder.com == \/\/\n";
        ObfuscateToPrint += "document.write(unescape('" + enctext + "'));\n";
        ObfuscateToPrint += "//-->\n";
        ObfuscateToPrint += "</script\>";
        theform.ecode.value = ObfuscateToPrint;
        theform.snapit.disabled = false;
    }
    return false;
}

function sandc(snapForm) { snapForm.ecode.focus();
    snapForm.ecode.select();
    copytext = snapForm.ecode.createTextRange();
    copytext.execCommand("Copy");
    alert("Copied the Obfuscated Document HTML Source Code to clipboard, you may now paste this code snippet into your web page."); }

function encrypt(tx) { var hex = ''; var i; for (i = 0; i < tx.length; i++) { hex += '%' + hexfromdec(tx.charCodeAt(i)) } return hex; }

function hexfromdec(num) { if (num > 65535) { return ("err!") }
    first = Math.round(num / 4096 - .5);
    temp1 = num - first * 4096;
    second = Math.round(temp1 / 256 - .5);
    temp2 = temp1 - second * 256;
    third = Math.round(temp2 / 16 - .5);
    fourth = temp2 - third * 16; return ("" + getletter(third) + getletter(fourth)); }

function getletter(num) { if (num < 10) { return num; } else { if (num == 10) { return "A" } if (num == 11) { return "B" } if (num == 12) { return "C" } if (num == 13) { return "D" } if (num == 14) { return "E" } if (num == 15) { return "F" } } }