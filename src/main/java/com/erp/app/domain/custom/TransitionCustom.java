package com.erp.app.domain.custom;

import com.erp.app.domain.Transition;
import com.erp.app.domain.Workflow;
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
    @CascadeSave
    //@ManyToOne(fetch = FetchType.EAGER)
    @ManyToOne
	@Field("workflow")
    // @JsonManagedReference
    private Workflow workflow;

    public TransitionCustom() {
        super();
    }

    public TransitionCustom(Workflow workflow) {
		super();
		this.workflow = workflow;
    }

    public Workflow getWorkflow() {
        return workflow;
    }

    public void setWorkflow(Workflow workflow) {
        this.workflow = workflow;
    }
}
