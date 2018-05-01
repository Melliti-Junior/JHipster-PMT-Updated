package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.Workflow;

import com.erp.app.repository.WorkflowRepository;
import com.erp.app.repository.search.WorkflowSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Workflow.
 */
@RestController
@RequestMapping("/api")
public class WorkflowResource {

    private final Logger log = LoggerFactory.getLogger(WorkflowResource.class);

    private static final String ENTITY_NAME = "workflow";

    private final WorkflowRepository workflowRepository;

    private final WorkflowSearchRepository workflowSearchRepository;

    public WorkflowResource(WorkflowRepository workflowRepository, WorkflowSearchRepository workflowSearchRepository) {
        this.workflowRepository = workflowRepository;
        this.workflowSearchRepository = workflowSearchRepository;
    }

    /**
     * POST  /workflows : Create a new workflow.
     *
     * @param workflow the workflow to create
     * @return the ResponseEntity with status 201 (Created) and with body the new workflow, or with status 400 (Bad Request) if the workflow has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/workflows")
    @Timed
    public ResponseEntity<Workflow> createWorkflow(@Valid @RequestBody Workflow workflow) throws URISyntaxException {
        log.debug("REST request to save Workflow : {}", workflow);
        if (workflow.getId() != null) {
            throw new BadRequestAlertException("A new workflow cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Workflow result = workflowRepository.save(workflow);
        workflowSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/workflows/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /workflows : Updates an existing workflow.
     *
     * @param workflow the workflow to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated workflow,
     * or with status 400 (Bad Request) if the workflow is not valid,
     * or with status 500 (Internal Server Error) if the workflow couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/workflows")
    @Timed
    public ResponseEntity<Workflow> updateWorkflow(@Valid @RequestBody Workflow workflow) throws URISyntaxException {
        log.debug("REST request to update Workflow : {}", workflow);
        if (workflow.getId() == null) {
            return createWorkflow(workflow);
        }
        Workflow result = workflowRepository.save(workflow);
        workflowSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, workflow.getId().toString()))
            .body(result);
    }

    /**
     * GET  /workflows : get all the workflows.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of workflows in body
     */
    @GetMapping("/workflows")
    @Timed
    public ResponseEntity<List<Workflow>> getAllWorkflows(Pageable pageable) {
        log.debug("REST request to get a page of Workflows");
        Page<Workflow> page = workflowRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/workflows");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /workflows/:id : get the "id" workflow.
     *
     * @param id the id of the workflow to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the workflow, or with status 404 (Not Found)
     */
    @GetMapping("/workflows/{id}")
    @Timed
    public ResponseEntity<Workflow> getWorkflow(@PathVariable String id) {
        log.debug("REST request to get Workflow : {}", id);
        Workflow workflow = workflowRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(workflow));
    }

    /**
     * DELETE  /workflows/:id : delete the "id" workflow.
     *
     * @param id the id of the workflow to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/workflows/{id}")
    @Timed
    public ResponseEntity<Void> deleteWorkflow(@PathVariable String id) {
        log.debug("REST request to delete Workflow : {}", id);
        workflowRepository.delete(id);
        workflowSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/workflows?query=:query : search for the workflow corresponding
     * to the query.
     *
     * @param query the query of the workflow search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/workflows")
    @Timed
    public ResponseEntity<List<Workflow>> searchWorkflows(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Workflows for query {}", query);
        Page<Workflow> page = workflowSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/workflows");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
