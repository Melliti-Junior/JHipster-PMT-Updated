package com.erp.app.domain.custom;

import com.erp.app.domain.Resolution;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomResolution extends Resolution implements Serializable {

	/**
	 *
	 */
	private static final long serialResolutionUID = 1L;

	public CustomResolution() {
		super();
	}

}
