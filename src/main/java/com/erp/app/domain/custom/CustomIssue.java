package com.erp.app.domain.custom;

import com.erp.app.domain.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomIssue extends Issue implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @Field("progress")
    private Integer progress;

	@DBRef
	@Field("type")
    private IssueType type;

	@DBRef
	@Field("priority")
    private IssuePriority priority;

	@DBRef
	@Field("epic")
    private Epic epic;

    @DBRef
	@Field("status")
    private Status status;

    @DBRef
	@Field("resolution")
    private Resolution resolution;

    @DBRef
    @Field("version")
    private CustomVersion version;

    @DBRef
    @Field("sprint")
    private CustomSprint sprint;

    @DBRef
	@Field("project")
    private CustomProject project;

    @DBRef
    @Field("reporter")
    private User reporter;

    @DBRef
    @Field("assignee")
    private User assignee;


    public CustomIssue(IssueType type, IssuePriority priority, Epic epic, CustomProject project, Status status, Resolution resolution, CustomVersion version, CustomSprint sprint) {
		super();
		this.type = type;
		this.priority = priority;
		this.epic = epic;
		this.project = project;
		this.status = status;
		this.resolution = resolution;
		this.version = version;
		this.sprint = sprint;
	}


	public CustomIssue() {
		super();
	}

	public IssueType getType() {
		return type;
	}

	public void setType(IssueType type) {
		this.type = type;
	}

	public IssuePriority getPriority() {
		return priority;
	}

	public void setPriority(IssuePriority priority) {
		this.priority = priority;
	}

	public Epic getEpic() {
		return epic;
	}

	public void setEpic(Epic epic) {
		this.epic = epic;
	}

	public CustomProject getProject() {
		return project;
	}

	public void setProject(CustomProject project) {
		this.project = project;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public Resolution getResolution() {
		return resolution;
	}

	public void setResolution(Resolution resolution) {
		this.resolution = resolution;
	}

    public CustomVersion getVersion() {
        return version;
    }

    public void setVersion(CustomVersion version) {
        this.version = version;
    }

    public CustomSprint getSprint() {
        return sprint;
    }

    public void setSprint(CustomSprint sprint) {
        this.sprint = sprint;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }
}
