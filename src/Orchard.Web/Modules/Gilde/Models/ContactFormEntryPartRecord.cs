using Orchard.ContentManagement.Records;
using System;

namespace Gilde.Models
{
    public class ContactFormEntryPartRecord : ContentPartRecord
    {
        public virtual string SenderName { get; set; }
        public virtual string SenderEmail { get; set; }
    }
}