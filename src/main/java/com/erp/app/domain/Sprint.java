package com.erp.app.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Sprint.
 */
@Document(collection = "sprint")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "sprint")
public class Sprint implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("code")
    private String code;

    @Field("name")
    private String name;

    @Min(value = 1)
    @Max(value = 4)
    @Field("duration")
    private Integer duration;

    @Field("start_date")
    private LocalDate startDate;

    @Field("end_date")
    private LocalDate endDate;

    @Field("goal")
    private String goal;

    @Field("is_active")
    private Boolean isActive;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public Sprint code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public Sprint name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDuration() {
        return duration;
    }

    public Sprint duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public Sprint startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Sprint endDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getGoal() {
        return goal;
    }

    public Sprint goal(String goal) {
        this.goal = goal;
        return this;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public Boolean isIsActive() {
        return isActive;
    }

    public Sprint isActive(Boolean isActive) {
        this.isActive = isActive;
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Sprint sprint = (Sprint) o;
        if (sprint.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sprint.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Sprint{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", duration=" + getDuration() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", goal='" + getGoal() + "'" +
            ", isActive='" + isIsActive() + "'" +
            "}";
    }
}
