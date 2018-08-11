package com.erp.app.domain.custom;

import com.erp.app.domain.Board;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomBoard extends Board implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;


    @DBRef
	@Field("project")
    private CustomProject project;

    public CustomBoard(CustomProject project) {
		super();
		this.project = project;
    }

	public CustomBoard() {
		super();
	}

	public CustomProject getProject() {
		return project;
	}

	public void setProject(CustomProject project) {
		this.project = project;
	}

}
