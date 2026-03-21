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
            // This satisfies JJWT's aggressive static initialization in Native Images
            String[] jjwtClasses = {
                // Core & Parser
                "io.jsonwebtoken.impl.DefaultJwtParserBuilder",
                "io.jsonwebtoken.impl.DefaultJwtBuilder",
                "io.jsonwebtoken.impl.DefaultJwtParser",
                "io.jsonwebtoken.impl.DefaultClaims",
                "io.jsonwebtoken.impl.DefaultHeader",
                "io.jsonwebtoken.impl.DefaultJweHeader",
                "io.jsonwebtoken.impl.DefaultProtectedHeader",
                "io.jsonwebtoken.impl.DefaultJweHeaderBuilder",
                "io.jsonwebtoken.impl.DefaultJweHeaderMutator",
                
                // Keys & JWK
                "io.jsonwebtoken.security.Jwks$OP",
                "io.jsonwebtoken.impl.security.KeysBridge",
                "io.jsonwebtoken.impl.security.AbstractJwk",
                "io.jsonwebtoken.impl.security.StandardAsymmetricJwk",
                "io.jsonwebtoken.impl.security.StandardEcdsaJwk",
                "io.jsonwebtoken.impl.security.StandardSecretJwk",
                "io.jsonwebtoken.impl.security.StandardRsaJwk",
                "io.jsonwebtoken.impl.security.StandardOctetPublicJwk",
                "io.jsonwebtoken.impl.security.StandardOctetPrivateJwk",
                
                // Operations & Providers
                "io.jsonwebtoken.impl.security.StandardKeyOperations",
                "io.jsonwebtoken.impl.security.KeyOperationConverter",
                "io.jsonwebtoken.impl.security.MacProvider",
                "io.jsonwebtoken.impl.security.RsaProvider",
                "io.jsonwebtoken.impl.security.EcProvider",
                "io.jsonwebtoken.impl.security.EdCProvider",
                "io.jsonwebtoken.impl.security.XProvider",
                "io.jsonwebtoken.impl.security.JweProviders",
                "io.jsonwebtoken.impl.security.HmacAesAeadAlgorithm",
                
                // Algorithms (JWS & JWE)
                "io.jsonwebtoken.Jwts$ENC",
                "io.jsonwebtoken.Jwts$SIG",
                "io.jsonwebtoken.Jwts$ZIP",
                "io.jsonwebtoken.impl.security.StandardSecureDigestAlgorithms",
                "io.jsonwebtoken.impl.security.StandardAsymmetricKeyAlgorithms",
                "io.jsonwebtoken.impl.security.StandardSymmetricKeyAlgorithms",
                "io.jsonwebtoken.impl.security.StandardEncryptionAlgorithms",
                "io.jsonwebtoken.impl.security.GcmAesAeadAlgorithm",
                "io.jsonwebtoken.impl.security.CbcHmacAeadAlgorithm",
                "io.jsonwebtoken.impl.security.AesGcmKeyAlgorithm",
                "io.jsonwebtoken.impl.security.AesWrapKeyAlgorithm",
                "io.jsonwebtoken.impl.security.RsaKeyAlgorithm",
                "io.jsonwebtoken.impl.security.EcdhKeyAlgorithm",
                "io.jsonwebtoken.impl.security.Pbes2HmacAescwKeyAlgorithm",
                
                // Compression
                "io.jsonwebtoken.impl.compression.StandardCompressionAlgorithms",
                "io.jsonwebtoken.impl.compression.DeflateCompressionAlgorithm",
                "io.jsonwebtoken.impl.compression.GzipCompressionAlgorithm"
            };

            for (String className : jjwtClasses) {
                // IMPORTANT: Using TypeReference instead of Class.forName avoids ClassNotFoundException 
                // during AOT phase when classes are intended for runtime use.
                hints.reflection().registerType(TypeReference.of(className), 
                    MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS, 
                    MemberCategory.INVOKE_PUBLIC_METHODS,
                    MemberCategory.DECLARED_FIELDS);
            }
        }
    }
}
