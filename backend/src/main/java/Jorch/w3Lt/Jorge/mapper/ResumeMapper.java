package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.EducationDTO;
import Jorch.w3Lt.Jorge.dto.ExperienceDTO;
import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.model.Education;
import Jorch.w3Lt.Jorge.model.Experience;
import Jorch.w3Lt.Jorge.model.Resume;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ResumeMapper {

    @Mapping(target = "location", source = "resume", qualifiedByName = "mapLocation")
    @Mapping(target = "summary", source = "resume", qualifiedByName = "mapSummary")
    @Mapping(target = "experiences", expression = "java(mapExperiences(resume.getExperiences(), locale))")
    @Mapping(target = "education", expression = "java(mapEducation(resume.getEducation(), locale))")
    ResumeDTO toDto(Resume resume, @Context String locale);

    @Named("mapLocation")
    default String mapLocation(Resume resume, @Context String locale) {
        if (locale == null) return resume.getLocationEn();
        return switch (locale.toLowerCase()) {
            case "de" -> resume.getLocationDe() != null ? resume.getLocationDe() : resume.getLocationEn();
            case "es" -> resume.getLocationEs() != null ? resume.getLocationEs() : resume.getLocationEn();
            default -> resume.getLocationEn();
        };
    }

    @Named("mapSummary")
    default String mapSummary(Resume resume, @Context String locale) {
        if (locale == null) return resume.getSummaryEn();
        return switch (locale.toLowerCase()) {
            case "de" -> resume.getSummaryDe() != null ? resume.getSummaryDe() : resume.getSummaryEn();
            case "es" -> resume.getSummaryEs() != null ? resume.getSummaryEs() : resume.getSummaryEn();
            default -> resume.getSummaryEn();
        };
    }

    default List<ExperienceDTO> mapExperiences(List<Experience> experiences, @Context String locale) {
        if (experiences == null) return null;
        return experiences.stream().map(e -> toDto(e, locale)).toList();
    }

    @Mapping(target = "title", source = "experience", qualifiedByName = "mapExperienceTitle")
    @Mapping(target = "location", source = "experience", qualifiedByName = "mapExperienceLocation")
    @Mapping(target = "description", source = "experience", qualifiedByName = "mapExperienceDescription")
    ExperienceDTO toDto(Experience experience, @Context String locale);

    @Named("mapExperienceTitle")
    default String mapExperienceTitle(Experience experience, @Context String locale) {
        if (locale == null) return experience.getTitleEn();
        return switch (locale.toLowerCase()) {
            case "de" -> experience.getTitleDe() != null ? experience.getTitleDe() : experience.getTitleEn();
            case "es" -> experience.getTitleEs() != null ? experience.getTitleEs() : experience.getTitleEn();
            default -> experience.getTitleEn();
        };
    }

    @Named("mapExperienceLocation")
    default String mapExperienceLocation(Experience experience, @Context String locale) {
        if (locale == null) return experience.getLocationEn();
        return switch (locale.toLowerCase()) {
            case "de" -> experience.getLocationDe() != null ? experience.getLocationDe() : experience.getLocationEn();
            case "es" -> experience.getLocationEs() != null ? experience.getLocationEs() : experience.getLocationEn();
            default -> experience.getLocationEn();
        };
    }

    @Named("mapExperienceDescription")
    default String mapExperienceDescription(Experience experience, @Context String locale) {
        if (locale == null) return experience.getDescriptionEn();
        return switch (locale.toLowerCase()) {
            case "de" -> experience.getDescriptionDe() != null ? experience.getDescriptionDe() : experience.getDescriptionEn();
            case "es" -> experience.getDescriptionEs() != null ? experience.getDescriptionEs() : experience.getDescriptionEn();
            default -> experience.getDescriptionEn();
        };
    }

    default List<EducationDTO> mapEducation(List<Education> education, @Context String locale) {
        if (education == null) return null;
        return education.stream().map(e -> toDto(e, locale)).toList();
    }

    @Mapping(target = "degree", source = "education", qualifiedByName = "mapEducationDegree")
    @Mapping(target = "location", source = "education", qualifiedByName = "mapEducationLocation")
    @Mapping(target = "description", source = "education", qualifiedByName = "mapEducationDescription")
    EducationDTO toDto(Education education, @Context String locale);

    @Named("mapEducationDegree")
    default String mapEducationDegree(Education education, @Context String locale) {
        if (locale == null) return education.getDegreeEn();
        return switch (locale.toLowerCase()) {
            case "de" -> education.getDegreeDe() != null ? education.getDegreeDe() : education.getDegreeEn();
            case "es" -> education.getDegreeEs() != null ? education.getDegreeEs() : education.getDegreeEn();
            default -> education.getDegreeEn();
        };
    }

    @Named("mapEducationLocation")
    default String mapEducationLocation(Education education, @Context String locale) {
        if (locale == null) return education.getLocationEn();
        return switch (locale.toLowerCase()) {
            case "de" -> education.getLocationDe() != null ? education.getLocationDe() : education.getLocationEn();
            case "es" -> education.getLocationEs() != null ? education.getLocationEs() : education.getLocationEn();
            default -> education.getLocationEn();
        };
    }

    @Named("mapEducationDescription")
    default String mapEducationDescription(Education education, @Context String locale) {
        if (locale == null) return education.getDescriptionEn();
        return switch (locale.toLowerCase()) {
            case "de" -> education.getDescriptionDe() != null ? education.getDescriptionDe() : education.getDescriptionEn();
            case "es" -> education.getDescriptionEs() != null ? education.getDescriptionEs() : education.getDescriptionEn();
            default -> education.getDescriptionEn();
        };
    }
}
