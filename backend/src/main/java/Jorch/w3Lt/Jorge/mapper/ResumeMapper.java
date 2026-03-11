package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.EducationDTO;
import Jorch.w3Lt.Jorge.dto.ExperienceDTO;
import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.model.Education;
import Jorch.w3Lt.Jorge.model.Experience;
import Jorch.w3Lt.Jorge.model.Resume;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ResumeMapper {
    ResumeDTO toDto(Resume resume);
    Resume toEntity(ResumeDTO resumeDTO);

    ExperienceDTO toDto(Experience experience);
    Experience toEntity(ExperienceDTO experienceDTO);

    EducationDTO toDto(Education education);
    Education toEntity(EducationDTO educationDTO);
}
