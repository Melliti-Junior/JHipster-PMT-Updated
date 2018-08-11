package com.erp.app.domain.custom;

import com.erp.app.domain.Status;
import com.erp.app.domain.Step;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomStep extends Step implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("status")
    private Status status;

    @DBRef
    @Field("workflow")
    private CustomWorkflow workflow;

    @DBRef
    @Field("column")
    private CustomColumn column;

    public CustomStep(Status status) {
		super();
		this.status = status;
    }

    public CustomStep(Status status, CustomWorkflow workflow) {
        this.status = status;
        this.workflow = workflow;
    }

    public CustomStep(Status status, CustomWorkflow workflow, CustomColumn column) {
        this.status = status;
        this.workflow = workflow;
        this.column = column;
    }

    public CustomStep() {
		super();
	}

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public CustomWorkflow getWorkflow() {
        return workflow;
    }

    public void setWorkflow(CustomWorkflow workflow) {
        this.workflow = workflow;
    }

    public CustomColumn getColumn() {
        return column;
    }

    public void setColumn(CustomColumn column) {
        this.column = column;
    }
}
