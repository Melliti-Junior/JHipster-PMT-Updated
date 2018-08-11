package com.erp.app.domain.custom;

import com.erp.app.domain.Version;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomVersion extends Version implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("project")
    private CustomProject project;

	public CustomVersion(CustomProject project) {
		super();
		this.project = project;
    }

	public CustomVersion() {
		super();
	}

	public CustomProject getProject() {
		return project;
	}

	public void setProject(CustomProject project) {
		this.project = project;
	}
}
