package com.erp.app.domain.custom;

import com.erp.app.domain.Workflow;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class WorkflowCustom extends Workflow implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	public WorkflowCustom() {
		super();
	}

}
