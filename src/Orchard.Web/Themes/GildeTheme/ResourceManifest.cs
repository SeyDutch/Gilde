using Orchard.UI.Resources;

namespace GildeTheme {
    public class ResourceManifest : IResourceManifestProvider {
        public void BuildManifests(ResourceManifestBuilder builder) {
            var manifest = builder.Add();

            manifest.DefineStyle("Styles").SetUrl("Styles.min.css");
            manifest.DefineStyle("CarouselWidget").SetUrl("Carousel.min.css");

            manifest.DefineScript("ClientBean").SetUrl("ClientBean.js").SetDependencies("jQuery", "Bootstrap", "Custom");
        }
    }
}
