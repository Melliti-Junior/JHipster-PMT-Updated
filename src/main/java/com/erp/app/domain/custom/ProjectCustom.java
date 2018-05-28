package com.erp.app.domain.custom;

import com.erp.app.domain.User;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.erp.app.domain.Program;
import com.erp.app.domain.Project;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;

@Entity
// @Document(collection = "project")
public class  ProjectCustom extends Project implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@DBRef
	@Field("program")
    private Program program;

    @DBRef
    @Field("process")
    private WorkflowCustom process;

    @DBRef
    @Field("lead")
    private User lead;

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

    public WorkflowCustom getProcess() {
        return process;
    }

    public void setProcess(WorkflowCustom process) {
        this.process = process;
    }

    public User getLead() {
        return lead;
    }

    public void setLead(User lead) {
        this.lead = lead;
    }
}
