using Orchard.ContentManagement;

namespace Gilde.Models
{
    public class ContactFormEntryPart : ContentPart<ContactFormEntryPartRecord>
    {
        public string SenderName
        {
            get { return Record.SenderName; }
            set { Record.SenderName = value; }
        }

        public string SenderEmail
        {
            get { return Record.SenderEmail; }
            set { Record.SenderEmail = value; }
        }
    }
}