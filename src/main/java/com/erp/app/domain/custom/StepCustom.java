package com.erp.app.domain.custom;

import com.erp.app.domain.Status;
import com.erp.app.domain.Step;
import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
// @Document(collection = "Step")
public class StepCustom extends Step implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("status")
    private Status status;

    @DBRef
    @Field("workflow")
    private WorkflowCustom workflow;

    @DBRef
    @Field("column")
    private ColumnCustom column;

    public StepCustom(Status status) {
		super();
		this.status = status;
    }

    public StepCustom(Status status, WorkflowCustom workflow) {
        this.status = status;
        this.workflow = workflow;
    }

    public StepCustom(Status status, WorkflowCustom workflow, ColumnCustom column) {
        this.status = status;
        this.workflow = workflow;
        this.column = column;
    }

    public StepCustom() {
		super();
	}

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public WorkflowCustom getWorkflow() {
        return workflow;
    }

    public void setWorkflow(WorkflowCustom workflow) {
        this.workflow = workflow;
    }

    public ColumnCustom getColumn() {
        return column;
    }

    public void setColumn(ColumnCustom column) {
        this.column = column;
    }
}
