package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.WorkflowCustom;
import com.erp.app.repository.custom.WorkflowCustomRepository;
import com.erp.app.repository.search.custom.WorkflowCustomSearchRepository;
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

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@RestController
@RequestMapping("/api/custom")
public class WorkflowCustomResource {

	private final Logger log = LoggerFactory.getLogger(WorkflowCustomResource.class);

    private static final String ENTITY_NAME = "workflowcustom";

    private final WorkflowCustomRepository workflowcustomRepository;

    private final WorkflowCustomSearchRepository workflowcustomSearchRepository;

    public WorkflowCustomResource(WorkflowCustomRepository workflowcustomRepository, WorkflowCustomSearchRepository workflowcustomSearchRepository) {
        this.workflowcustomRepository = workflowcustomRepository;
        this.workflowcustomSearchRepository = workflowcustomSearchRepository;
    }

    /**
     * POST  /workflowcustoms : Create a new workflowcustom.
     *
     * @param workflowcustom the workflowcustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new workflowcustom, or with status 400 (Bad Request) if the workflowcustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/workflowcustoms")
    @Timed
    public ResponseEntity<WorkflowCustom> createWorkflowCustom(@Valid @RequestBody WorkflowCustom workflowcustom) throws URISyntaxException {
        log.debug("REST request to save WorkflowCustom : {}", workflowcustom);
        if (workflowcustom.getId() != null) {
            throw new BadRequestAlertException("A new workflowcustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkflowCustom result = workflowcustomRepository.save(workflowcustom);
        workflowcustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/workflowcustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /workflowcustoms : Updates an existing workflowcustom.
     *
     * @param workflowcustom the workflowcustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated workflowcustom,
     * or with status 400 (Bad Request) if the workflowcustom is not valid,
     * or with status 500 (Internal Server Error) if the workflowcustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/workflowcustoms")
    @Timed
    public ResponseEntity<WorkflowCustom> updateWorkflowCustom(@Valid @RequestBody WorkflowCustom workflowcustom) throws URISyntaxException {
        log.debug("REST request to update WorkflowCustom : {}", workflowcustom);
        if (workflowcustom.getId() == null) {
            return createWorkflowCustom(workflowcustom);
        }
        WorkflowCustom result = workflowcustomRepository.save(workflowcustom);
        workflowcustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, workflowcustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /workflowcustoms : get all the workflowcustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of workflowcustoms in body
     */
    @GetMapping("/workflowcustoms")
    @Timed
    public ResponseEntity<List<WorkflowCustom>> getAllWorkflowCustoms(Pageable pageable) {
        log.debug("REST request to get a page of WorkflowCustoms");
        Page<WorkflowCustom> page = workflowcustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/workflowcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /workflowcustoms/:id : get the "id" workflowcustom.
     *
     * @param id the id of the workflowcustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the workflowcustom, or with status 404 (Not Found)
     */
    @GetMapping("/workflowcustoms/{id}")
    @Timed
    public ResponseEntity<WorkflowCustom> getWorkflowCustom(@PathVariable String id) {
        log.debug("REST request to get WorkflowCustom : {}", id);
        WorkflowCustom workflowcustom = workflowcustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(workflowcustom));
    }

    /**
     * DELETE  /workflowcustoms/:id : delete the "id" workflowcustom.
     *
     * @param id the id of the workflowcustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/workflowcustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteWorkflowCustom(@PathVariable String id) {
        log.debug("REST request to delete WorkflowCustom : {}", id);
        workflowcustomRepository.delete(id);
        workflowcustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/workflowcustoms?query=:query : search for the workflowcustom corresponding
     * to the query.
     *
     * @param query the query of the workflowcustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/workflowcustoms")
    @Timed
    public ResponseEntity<List<WorkflowCustom>> searchWorkflowCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of WorkflowCustoms for query {}", query);
        Page<WorkflowCustom> page = workflowcustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/workflowcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
