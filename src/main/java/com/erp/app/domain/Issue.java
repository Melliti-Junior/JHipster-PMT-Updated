package com.erp.app.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Issue.
 */
@Document(collection = "issue")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "issue")
public class Issue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("code")
    private String code;

    @Field("summary")
    private String summary;

    @Field("created_date")
    private LocalDate createdDate;

    @Field("due_date")
    private LocalDate dueDate;

    @Field("estimation")
    private Integer estimation;

    @Field("description")
    private String description;

    @Field("updated_date")
    private LocalDate updatedDate;

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

    public Issue code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getSummary() {
        return summary;
    }

    public Issue summary(String summary) {
        this.summary = summary;
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public Issue createdDate(LocalDate createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Issue dueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
        return this;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getEstimation() {
        return estimation;
    }

    public Issue estimation(Integer estimation) {
        this.estimation = estimation;
        return this;
    }

    public void setEstimation(Integer estimation) {
        this.estimation = estimation;
    }

    public String getDescription() {
        return description;
    }

    public Issue description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getUpdatedDate() {
        return updatedDate;
    }

    public Issue updatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
        return this;
    }

    public void setUpdatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
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
        Issue issue = (Issue) o;
        if (issue.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), issue.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Issue{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", summary='" + getSummary() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", dueDate='" + getDueDate() + "'" +
            ", estimation=" + getEstimation() +
            ", description='" + getDescription() + "'" +
            ", updatedDate='" + getUpdatedDate() + "'" +
            "}";
    }
}
