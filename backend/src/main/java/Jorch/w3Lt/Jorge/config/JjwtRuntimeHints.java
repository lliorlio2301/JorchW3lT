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

            // Comprehensive JJWT Reflection Registration
            String[] jjwtClasses = {
                "io.jsonwebtoken.impl.DefaultJwtParserBuilder",
                "io.jsonwebtoken.impl.DefaultJwtBuilder",
                "io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms",
                "io.jsonwebtoken.impl.security.StandardKeyOperations",
                "io.jsonwebtoken.impl.security.KeyOperationConverter",
                "io.jsonwebtoken.impl.DefaultJwtParser",
                "io.jsonwebtoken.impl.DefaultHeader",
                "io.jsonwebtoken.impl.DefaultJweHeader",
                "io.jsonwebtoken.impl.DefaultProtectedHeader",
                "io.jsonwebtoken.impl.DefaultJweHeaderBuilder",
                "io.jsonwebtoken.impl.DefaultJweHeaderMutator",
                "io.jsonwebtoken.impl.DefaultClaims",
                "io.jsonwebtoken.security.Jwks$OP",
                "io.jsonwebtoken.impl.security.AbstractJwk"
            };

            for (String className : jjwtClasses) {
                registerForReflection(hints, className);
            }
        }

        private void registerForReflection(RuntimeHints hints, String className) {
            try {
                hints.reflection().registerType(Class.forName(className), 
                    MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS, 
                    MemberCategory.INVOKE_PUBLIC_METHODS,
                    MemberCategory.DECLARED_FIELDS);
            } catch (ClassNotFoundException e) {
                // Class might not be on classpath depending on JJWT version
            }
        }
    }
}
