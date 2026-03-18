package Jorch.w3Lt.Jorge.config;

import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

@Configuration
@ImportRuntimeHints(JjwtRuntimeHints.JjwtRuntimeHintsRegistrar.class)
public class JjwtRuntimeHints {

    public static class JjwtRuntimeHintsRegistrar implements RuntimeHintsRegistrar {
        @Override
        public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
            // Register classes for reflection that JJWT loads dynamically
            try {
                hints.reflection().registerType(Class.forName("io.jsonwebtoken.impl.DefaultJwtParserBuilder"));
                hints.reflection().registerType(Class.forName("io.jsonwebtoken.impl.DefaultJwtBuilder"));
                hints.reflection().registerType(Class.forName("io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms"));
                hints.reflection().registerType(Class.forName("io.jsonwebtoken.impl.DefaultJwtParser"));
                // Add more if needed based on the logs
            } catch (ClassNotFoundException e) {
                // Ignore if not present in classpath
            }
        }
    }
}
