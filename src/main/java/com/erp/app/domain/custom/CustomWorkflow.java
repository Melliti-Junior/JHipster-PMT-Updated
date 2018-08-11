package com.erp.app.domain.custom;

import com.erp.app.domain.Workflow;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomWorkflow extends Workflow implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	public CustomWorkflow() {
		super();
	}

}
