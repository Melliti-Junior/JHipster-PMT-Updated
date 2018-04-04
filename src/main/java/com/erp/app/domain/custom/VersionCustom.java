package com.erp.app.domain.custom;

import com.erp.app.domain.*;
import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
// @Document(collection = "version")
public class VersionCustom extends Version implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
    @CascadeSave
    //@ManyToOne(fetch = FetchType.EAGER)
    @ManyToOne
	@Field("project")
    // @JsonManagedReference
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
