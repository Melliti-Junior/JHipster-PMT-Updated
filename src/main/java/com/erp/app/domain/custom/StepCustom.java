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
    @CascadeSave
    //@ManyToOne(fetch = FetchType.EAGER)
    @ManyToOne
	@Field("status")
    // @JsonManagedReference
    private Status status;

	public StepCustom(Status status) {
		super();
		this.status = status;
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
}
