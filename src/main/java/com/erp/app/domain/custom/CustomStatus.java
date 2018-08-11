package com.erp.app.domain.custom;

import com.erp.app.domain.Category;
import com.erp.app.domain.Status;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import java.io.Serializable;

@Entity
public class CustomStatus extends Status implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

    @DBRef
    @Field("category")
    private Category category;

    public CustomStatus() {
        super();
    }

    public CustomStatus(Category category) {
        this.category = category;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
