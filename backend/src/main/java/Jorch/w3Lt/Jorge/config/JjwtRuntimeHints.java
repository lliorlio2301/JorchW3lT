package Jorch.w3Lt.Jorge.config;

import org.springframework.aot.hint.MemberCategory;
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
            // Register Flyway migrations
            hints.resources().registerPattern("db/migration/*.sql");

            // Register classes for reflection that JJWT loads dynamically via Reflection
            // We must include PUBLIC CONSTRUCTORS to fix NoSuchMethodException: <init>()
            registerForReflection(hints, "io.jsonwebtoken.impl.DefaultJwtParserBuilder");
            registerForReflection(hints, "io.jsonwebtoken.impl.DefaultJwtBuilder");
            registerForReflection(hints, "io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms");
            registerForReflection(hints, "io.jsonwebtoken.impl.DefaultJwtParser");
            registerForReflection(hints, "io.jsonwebtoken.impl.DefaultHeader");
            registerForReflection(hints, "io.jsonwebtoken.impl.DefaultClaims");
        }

        private void registerForReflection(RuntimeHints hints, String className) {
            try {
                hints.reflection().registerType(Class.forName(className), 
                    MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS, 
                    MemberCategory.INVOKE_PUBLIC_METHODS);
            } catch (ClassNotFoundException e) {
                // Ignore if class is not on classpath
            }
        }
    }
}
