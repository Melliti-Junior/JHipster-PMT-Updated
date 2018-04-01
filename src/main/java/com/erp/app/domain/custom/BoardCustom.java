package com.erp.app.domain.custom;

import com.erp.app.domain.Board;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
// @Document(collection = "board")
public class BoardCustom extends Board implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;


    @DBRef
	@Field("project")
    private ProjectCustom project;

	public BoardCustom(ProjectCustom project) {
		super();
		this.project = project;
    }

	public BoardCustom() {
		super();
	}

	public ProjectCustom getProject() {
		return project;
	}

	public void setProject(ProjectCustom project) {
		this.project = project;
	}

}
