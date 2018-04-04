package com.erp.app.domain.custom;

import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import com.erp.app.domain.Epic;
import com.erp.app.domain.Issue;
import com.erp.app.domain.IssuePriority;
import com.erp.app.domain.IssueType;
import com.erp.app.domain.Resolution;
import com.erp.app.domain.Status;

import javax.persistence.*;
import java.io.Serializable;

@Entity
// @Document(collection = "issue")
public class IssueCustom extends Issue implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

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
    private VersionCustom version;

    @DBRef
    @CascadeSave
    //@ManyToOne(fetch = FetchType.EAGER)
    @ManyToOne
	@Field("project")
    // @JsonManagedReference
    private ProjectCustom project;

	public IssueCustom(IssueType type, IssuePriority priority, Epic epic, ProjectCustom project) {
		super();
		this.type = type;
		this.priority = priority;
		this.epic = epic;
		this.project = project;
    }

    public IssueCustom(IssueType type, IssuePriority priority, Epic epic, ProjectCustom project, Status status, Resolution resolution, VersionCustom version) {
		super();
		this.type = type;
		this.priority = priority;
		this.epic = epic;
		this.project = project;
		this.status = status;
		this.resolution = resolution;
		this.version = version;
	}


	public IssueCustom() {
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

	public ProjectCustom getProject() {
		return project;
	}

	public void setProject(ProjectCustom project) {
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

    public VersionCustom getVersion() {
        return version;
    }

    public void setVersion(VersionCustom version) {
        this.version = version;
    }
}
