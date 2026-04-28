# 📧 Kontaktformular-Setup Anleitung

## Überblick

Das Kontaktformular auf der Website nutzt **EmailJS**, um Nachrichten direkt an deine E-Mail zu versenden - **ohne Backend-Server erforderlich!**

---

## ✅ Schritt-für-Schritt Setup

### Schritt 1: EmailJS Account erstellen
1. Gehe zu https://www.emailjs.com
2. Klicke auf **"Sign Up for Free"**
3. Registriere dich mit einer E-Mail-Adresse
4. Bestätige deine E-Mail

### Schritt 2: Email Service hinzufügen
1. Logg dich bei EmailJS ein
2. Gehe zu **"Email Services"** (linkes Menü)
3. Klicke auf **"Add Service"**
4. Wähle deinen E-Mail-Anbieter:
   - **Gmail**: Klicke auf Gmail, autorisiere dein Konto
   - **Andere**: Füge SMTP-Einstellungen hinzu
5. Klicke **"Create Service"** und notiere die **Service ID** (z.B. `service_xxxxx`)

### Schritt 3: Email Template erstellen
1. Gehe zu **"Email Templates"**
2. Klicke auf **"Create New Template"**
3. Template-Name: `contact_form_template`
4. Ersetze den Content mit folgendem:

```
Subject: Neue Nachricht von {{user_name}}

Absender: {{user_name}}
E-Mail: {{user_email}}

Nachricht:
{{message}}
```

5. Klicke **"Save"** und notiere die **Template ID** (z.B. `template_xxxxx`)

### Schritt 4: Public Key kopieren
1. Gehe zu **Account Settings** (oben rechts)
2. Kopiere deine **Public Key** (z.B. `xxxxxxxxxxxxx`)

### Schritt 5: Code aktualisieren

Öffne die Datei `JS/script-index.js` und ersetze folgende Zeilen:

**Zeile 11:**
```javascript
emailjs.init('DEINE_PUBLIC_KEY_HIER');
```

**Zeile 55:**
```javascript
emailjs.send(
    'DEINE_SERVICE_ID_HIER',      
    'DEINE_TEMPLATE_ID_HIER',     
    {
        to_email: 'DEINE_EMAIL@example.com',  
        user_name: name,
        user_email: email,
        message: message
    }
)
```

**Beispiel (nach dem Ausfüllen):**
```javascript
emailjs.init('abcd1234efgh5678ijkl9012');

emailjs.send(
    'service_abc123def',      
    'template_xyz789abc',     
    {
        to_email: 'kontakt@beachresorthangout.de',
        user_name: name,
        user_email: email,
        message: message
    }
)
```

---

## 🧪 Testen

1. Gehe zur Website und öffne die Kontakt-Section
2. Fülle das Formular aus
3. Klicke "Nachricht senden"
4. Du solltest eine Bestätigung sehen
5. Überprüfe dein E-Mail-Postfach

---

## 🚨 Häufige Fehler

### ❌ "Invalid Public Key"
→ Überprüfe, ob du die richtige Public Key kopiert hast

### ❌ "Service or Template not found"
→ Überprüfe Service ID und Template ID

### ❌ "SMTP Error"
→ Bei Gmail: Aktiviere "Weniger sichere Apps" oder nutze ein App-Passwort

### ❌ Nachricht wird nicht versendet
→ Überprüfe die Browser-Konsole (F12 → Console) auf Fehlermeldungen

---

## 📊 EmailJS Limits (kostenlos)

- **200 E-Mails pro Monat**
- **50 E-Mails pro Tag**
- Unbegrenzte Vorlagen
- Unbegrenzte Services

Für mehr: Upgrade auf Premium

---

## 🔒 Sicherheit

- Die Public Key ist sichtbar im Code (das ist OK!)
- Private Daten werden NICHT exposed
- EmailJS handle alle Versendung sicher

---

## 📞 Hilfe

- EmailJS Support: https://www.emailjs.com/docs
- Fragen? Check die Browser-Konsole (F12)
- Kontaktiere den Support wenn nötig

---

**Viel Erfolg! 🚀**
