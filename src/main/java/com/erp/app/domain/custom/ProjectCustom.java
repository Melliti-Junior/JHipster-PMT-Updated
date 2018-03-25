package com.erp.app.domain.custom;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import com.erp.app.domain.Program;
import com.erp.app.domain.Project;

public class  ProjectCustom extends Project {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@DBRef
	@Field("program")
    private Program program;

	public ProjectCustom(Program program) {
		super();
		this.program = program;
	}


	public ProjectCustom() {
		super();
	}

	public Program getProgram() {
		return program;
	}

	public void setProgram(Program program) {
		this.program = program;
	}

}
