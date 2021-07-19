module.exports = name => {
    return name.replace(/(.?)([\/\-])(.?)/g, (match, $1, $2, $3) => { // this is to allow the browser to line break on "/" or "-". It pads it with spaces transforming it into " / ".
        if ($1 !== "" && $1 !== " ") { // if its the beginning of the string or it already has a space skip
            $1 = $1 + " ";
        }
        if ($3 !== "" && $3 !== " ") { // if its the end of the string or it already has a space skip
            $3 = " " + $3;
        }
        return $1 + $2 + $3;
    }).replace(/Teacher of Record:[^\n\t]*/, ''); // when copying and pasting data sometimes the fourth class name will look like this "[classname]Teach of Record: [Teach Last Name, First Name]  ([Date]). This takes that out.
}

