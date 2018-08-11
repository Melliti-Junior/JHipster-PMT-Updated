package com.erp.app.domain.custom;

import com.erp.app.domain.Program;
import com.erp.app.domain.Project;
import com.erp.app.domain.User;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomProject extends Project implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@DBRef
	@Field("program")
    private Program program;

    @DBRef
    @Field("process")
    private CustomWorkflow process;

    @DBRef
    @Field("lead")
    private User lead;

	public CustomProject(Program program) {
		super();
		this.program = program;
    }

    public CustomProject() {
		super();
	}

	public Program getProgram() {
		return program;
    }

    public void setProgram(Program program) {
		this.program = program;
	}

    public CustomWorkflow getProcess() {
        return process;
    }

    public void setProcess(CustomWorkflow process) {
        this.process = process;
    }

    public User getLead() {
        return lead;
    }

    public void setLead(User lead) {
        this.lead = lead;
    }
}
