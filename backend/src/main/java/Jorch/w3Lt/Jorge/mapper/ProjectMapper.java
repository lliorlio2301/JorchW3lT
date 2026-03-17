package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.ProjectCreateDTO;
import Jorch.w3Lt.Jorge.dto.ProjectDTO;
import Jorch.w3Lt.Jorge.model.Project;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "title", source = "project", qualifiedByName = "mapTitle")
    @Mapping(target = "description", source = "project", qualifiedByName = "mapDescription")
    ProjectDTO toDto(Project project, @Context String locale);

    @Mapping(target = "id", source = "id")
    ProjectCreateDTO toCreateDto(Project project);

    @Mapping(target = "id", source = "id")
    Project toEntity(ProjectCreateDTO dto);

    @Named("mapTitle")
    default String mapTitle(Project project, @Context String locale) {
        if (locale == null) return project.getTitleEn();
        return switch (locale.toLowerCase()) {
            case "de" -> project.getTitleDe() != null ? project.getTitleDe() : project.getTitleEn();
            case "es" -> project.getTitleEs() != null ? project.getTitleEs() : project.getTitleEn();
            default -> project.getTitleEn();
        };
    }

    @Named("mapDescription")
    default String mapDescription(Project project, @Context String locale) {
        if (locale == null) return project.getDescriptionEn();
        return switch (locale.toLowerCase()) {
            case "de" -> project.getDescriptionDe() != null ? project.getDescriptionDe() : project.getDescriptionEn();
            case "es" -> project.getDescriptionEs() != null ? project.getDescriptionEs() : project.getDescriptionEn();
            default -> project.getDescriptionEn();
        };
    }
}
