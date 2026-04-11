package Jorch.w3Lt.Jorge.config;

import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

@Configuration
@ImportRuntimeHints(MediaRuntimeHints.MediaHintsRegistrar.class)
public class MediaRuntimeHints {

    static class MediaHintsRegistrar implements RuntimeHintsRegistrar {
        @Override
        public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
            // Register ImageIO SPIs and Scrimage classes for reflection/resources if needed
            // For now, most of Scrimage core works with standard Java, 
            // but we register common image types just in case.
            hints.resources().registerPattern("META-INF/services/javax.imageio.spi.*");
        }
    }
}
