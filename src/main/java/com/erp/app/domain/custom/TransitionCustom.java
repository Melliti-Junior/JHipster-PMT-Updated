package com.erp.app.domain.custom;

import com.erp.app.domain.Transition;
import com.erp.app.domain.util.CascadeSave;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
// @Document(collection = "Transition")
public class TransitionCustom extends Transition implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("workflow")
    private WorkflowCustom workflow;

    @DBRef
    @Field("sourceStep")
    private StepCustom sourceStep;

    @DBRef
    @Field("targetStep")
    private StepCustom targetStep;


    public TransitionCustom() {
        super();
    }

    public TransitionCustom(WorkflowCustom workflow, StepCustom sourceStep, StepCustom targetStep) {
        this.workflow = workflow;
        this.sourceStep = sourceStep;
        this.targetStep = targetStep;
    }

    public WorkflowCustom getWorkflow() {
        return workflow;
    }

    public void setWorkflow(WorkflowCustom workflow) {
        this.workflow = workflow;
    }

    public StepCustom getSourceStep() {
        return sourceStep;
    }

    public void setSourceStep(StepCustom sourceStep) {
        this.sourceStep = sourceStep;
    }

    public StepCustom getTargetStep() {
        return targetStep;
    }

    public void setTargetStep(StepCustom targetStep) {
        this.targetStep = targetStep;
    }
}
