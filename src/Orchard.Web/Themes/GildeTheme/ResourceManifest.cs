using Orchard.UI.Resources;

namespace GildeTheme {
    public class ResourceManifest : IResourceManifestProvider {
        public void BuildManifests(ResourceManifestBuilder builder) {
            var manifest = builder.Add();
            
           // manifest.DefineScript("Bootstrap").SetUrl("bootstrap-3.3.5/js/bootstrap.min.js", "bootstrap-3.3.5/js/bootstrap.js").SetVersion("3.3.4").SetDependencies("jQuery");
           // manifest.DefineScript("Custom").SetUrl("custom.js").SetDependencies("jQuery");
        }
    }
}
