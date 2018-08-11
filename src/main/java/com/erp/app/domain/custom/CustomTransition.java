package com.erp.app.domain.custom;

import com.erp.app.domain.Transition;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomTransition extends Transition implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
	@Field("workflow")
    private CustomWorkflow workflow;

    @DBRef
    @Field("sourceStep")
    private CustomStep sourceStep;

    @DBRef
    @Field("targetStep")
    private CustomStep targetStep;


    public CustomTransition() {
        super();
    }

    public CustomTransition(CustomWorkflow workflow, CustomStep sourceStep, CustomStep targetStep) {
        this.workflow = workflow;
        this.sourceStep = sourceStep;
        this.targetStep = targetStep;
    }

    public CustomWorkflow getWorkflow() {
        return workflow;
    }

    public void setWorkflow(CustomWorkflow workflow) {
        this.workflow = workflow;
    }

    public CustomStep getSourceStep() {
        return sourceStep;
    }

    public void setSourceStep(CustomStep sourceStep) {
        this.sourceStep = sourceStep;
    }

    public CustomStep getTargetStep() {
        return targetStep;
    }

    public void setTargetStep(CustomStep targetStep) {
        this.targetStep = targetStep;
    }
}
