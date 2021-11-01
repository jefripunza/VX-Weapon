function formatter(number, standard = "@s.whatsapp.net") {
    let formatted = number;
    // const standard = '@c.us'; // @s.whatsapp.net / @c.us
    if (!String(formatted).endsWith("@g.us")) {
        // isGroup ? next
        // 1. Menghilangkan karakter selain angka
        formatted = number.replace(/\D/g, "");
        // 2. Menghilangkan angka 62 di depan (prefix)
        //    Kemudian diganti dengan 0
        if (formatted.startsWith("0")) {
            formatted = "62" + formatted.substr(1);
        }
        // 3. Tambahkan standar pengiriman whatsapp
        if (!String(formatted).endsWith(standard)) {
            formatted += standard;
        }
    }
    return formatted;
}

module.exports = formatter;