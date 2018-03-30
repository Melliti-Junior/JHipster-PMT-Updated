package com.erp.app.domain.custom;

import com.erp.app.domain.Issue;
import com.erp.app.domain.util.validations.CascadeSave;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.erp.app.domain.Program;
import com.erp.app.domain.Project;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
// @Document(collection = "project")
public class  ProjectCustom extends Project implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@DBRef
	@Field("program")
    private Program program;

    @DBRef
    // @CascadeSave
    // @JsonBackReference
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Field("issues")
    private List<IssueCustom> issues = new ArrayList<IssueCustom>();

	public ProjectCustom(Program program) {
		super();
		this.program = program;
    }

    public ProjectCustom(Program program, List<IssueCustom> issues) {
        super();
        this.program = program;
        this.issues = issues;
    }

    public ProjectCustom() {
		super();
	}

	public Program getProgram() {
		return program;
    }

    public void setProgram(Program program) {
		this.program = program;
	}


    public List<IssueCustom> getIssues() {
        return issues;
    }

    public void setIssues(List<IssueCustom> issues) {
        this.issues = issues;
    }

}
