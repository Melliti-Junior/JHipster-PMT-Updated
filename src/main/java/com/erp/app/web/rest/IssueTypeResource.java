package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.IssueType;

import com.erp.app.repository.IssueTypeRepository;
import com.erp.app.repository.search.IssueTypeSearchRepository;
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
 * REST controller for managing IssueType.
 */
@RestController
@RequestMapping("/api")
public class IssueTypeResource {

    private final Logger log = LoggerFactory.getLogger(IssueTypeResource.class);

    private static final String ENTITY_NAME = "issueType";

    private final IssueTypeRepository issueTypeRepository;

    private final IssueTypeSearchRepository issueTypeSearchRepository;

    public IssueTypeResource(IssueTypeRepository issueTypeRepository, IssueTypeSearchRepository issueTypeSearchRepository) {
        this.issueTypeRepository = issueTypeRepository;
        this.issueTypeSearchRepository = issueTypeSearchRepository;
    }

    /**
     * POST  /issue-types : Create a new issueType.
     *
     * @param issueType the issueType to create
     * @return the ResponseEntity with status 201 (Created) and with body the new issueType, or with status 400 (Bad Request) if the issueType has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/issue-types")
    @Timed
    public ResponseEntity<IssueType> createIssueType(@Valid @RequestBody IssueType issueType) throws URISyntaxException {
        log.debug("REST request to save IssueType : {}", issueType);
        if (issueType.getId() != null) {
            throw new BadRequestAlertException("A new issueType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IssueType result = issueTypeRepository.save(issueType);
        issueTypeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/issue-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /issue-types : Updates an existing issueType.
     *
     * @param issueType the issueType to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated issueType,
     * or with status 400 (Bad Request) if the issueType is not valid,
     * or with status 500 (Internal Server Error) if the issueType couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/issue-types")
    @Timed
    public ResponseEntity<IssueType> updateIssueType(@Valid @RequestBody IssueType issueType) throws URISyntaxException {
        log.debug("REST request to update IssueType : {}", issueType);
        if (issueType.getId() == null) {
            return createIssueType(issueType);
        }
        IssueType result = issueTypeRepository.save(issueType);
        issueTypeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, issueType.getId().toString()))
            .body(result);
    }

    /**
     * GET  /issue-types : get all the issueTypes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of issueTypes in body
     */
    @GetMapping("/issue-types")
    @Timed
    public ResponseEntity<List<IssueType>> getAllIssueTypes(Pageable pageable) {
        log.debug("REST request to get a page of IssueTypes");
        Page<IssueType> page = issueTypeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/issue-types");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /issue-types/:id : get the "id" issueType.
     *
     * @param id the id of the issueType to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the issueType, or with status 404 (Not Found)
     */
    @GetMapping("/issue-types/{id}")
    @Timed
    public ResponseEntity<IssueType> getIssueType(@PathVariable String id) {
        log.debug("REST request to get IssueType : {}", id);
        IssueType issueType = issueTypeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(issueType));
    }

    /**
     * DELETE  /issue-types/:id : delete the "id" issueType.
     *
     * @param id the id of the issueType to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/issue-types/{id}")
    @Timed
    public ResponseEntity<Void> deleteIssueType(@PathVariable String id) {
        log.debug("REST request to delete IssueType : {}", id);
        issueTypeRepository.delete(id);
        issueTypeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/issue-types?query=:query : search for the issueType corresponding
     * to the query.
     *
     * @param query the query of the issueType search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/issue-types")
    @Timed
    public ResponseEntity<List<IssueType>> searchIssueTypes(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of IssueTypes for query {}", query);
        Page<IssueType> page = issueTypeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/issue-types");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
