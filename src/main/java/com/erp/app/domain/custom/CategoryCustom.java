package com.erp.app.domain.custom;

import com.erp.app.domain.Category;
import com.erp.app.domain.Category;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
// @Document(collection = "Category")
public class CategoryCustom extends Category implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    public CategoryCustom() {
        super();
    }

}
