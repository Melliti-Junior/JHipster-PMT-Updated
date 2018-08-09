package com.erp.app.domain.custom;

import com.erp.app.domain.Version;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class VersionCustom extends Version implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("project")
    private ProjectCustom project;

	public VersionCustom(ProjectCustom project) {
		super();
		this.project = project;
    }

	public VersionCustom() {
		super();
	}

	public ProjectCustom getProject() {
		return project;
	}

	public void setProject(ProjectCustom project) {
		this.project = project;
	}
}
