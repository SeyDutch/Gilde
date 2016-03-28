using Gilde.Models;
using Gilde.ViewModels;
using Orchard;

namespace Gilde.Services
{
    public interface IContactInfoService : IDependency
    {
        ContactPage GetInfo();

        ContactPage EditInfo(ContactPage edit);

        ContactPageViewModel Convert(ContactPage model);
        ContactPage Convert(ContactPageViewModel model);
    }
}
