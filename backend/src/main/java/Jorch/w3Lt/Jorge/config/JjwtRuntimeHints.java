package Jorch.w3Lt.Jorge.config;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.aot.hint.TypeReference;
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
            
            // Register JJWT ServiceLoader configurations
            hints.resources().registerPattern("META-INF/services/io.jsonwebtoken.*");

            // Comprehensive JJWT Reflection Registration using TypeReference
            String[] jjwtClasses = {
                "io.jsonwebtoken.impl.DefaultJwtParserBuilder",
                "io.jsonwebtoken.impl.DefaultJwtBuilder",
                "io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms",
                "io.jsonwebtoken.impl.security.StandardKeyOperations",
                "io.jsonwebtoken.impl.security.StandardAsymmetricKeyAlgorithms",
                "io.jsonwebtoken.impl.security.StandardSymmetricKeyAlgorithms",
                "io.jsonwebtoken.impl.security.KeyOperationConverter",
                "io.jsonwebtoken.impl.DefaultJwtParser",
                "io.jsonwebtoken.impl.DefaultHeader",
                "io.jsonwebtoken.impl.DefaultJweHeader",
                "io.jsonwebtoken.impl.DefaultProtectedHeader",
                "io.jsonwebtoken.impl.DefaultJweHeaderBuilder",
                "io.jsonwebtoken.impl.DefaultJweHeaderMutator",
                "io.jsonwebtoken.impl.DefaultClaims",
                "io.jsonwebtoken.security.Jwks$OP",
                "io.jsonwebtoken.impl.security.AbstractJwk",
                "io.jsonwebtoken.impl.security.StandardAsymmetricJwk",
                "io.jsonwebtoken.impl.security.StandardEcdsaJwk",
                // Additional classes for authentication and keys
                "io.jsonwebtoken.impl.security.KeysBridge",
                "io.jsonwebtoken.impl.security.MacProvider",
                "io.jsonwebtoken.impl.security.RsaProvider",
                "io.jsonwebtoken.impl.security.EcProvider",
                "io.jsonwebtoken.impl.security.EdCProvider",
                "io.jsonwebtoken.impl.security.XProvider",
                "io.jsonwebtoken.impl.security.AesGcmKeyAlgorithm"
            };

            for (String className : jjwtClasses) {
                hints.reflection().registerType(TypeReference.of(className), 
                    MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS, 
                    MemberCategory.INVOKE_PUBLIC_METHODS,
                    MemberCategory.DECLARED_FIELDS);
            }
        }
    }
}
